import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { TokenStorage } from '../../storage/tokenStorage';
import { addBreadcrumb } from '../../services/monitoring';

// ── Refresh queue state ────────────────────────────────────────────────────────
// Prevents multiple simultaneous 401s from each triggering their own refresh.
// While a refresh is in-flight, subsequent 401s are queued and resolved
// (or rejected) when the refresh completes.

let isRefreshing = false;

type QueueEntry = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

const refreshQueue: QueueEntry[] = [];

function resolveQueue(newToken: string): void {
  refreshQueue.forEach((entry) => entry.resolve(newToken));
  refreshQueue.length = 0;
}

function rejectQueue(error: unknown): void {
  refreshQueue.forEach((entry) => entry.reject(error));
  refreshQueue.length = 0;
}

// ── Logout helper ──────────────────────────────────────────────────────────────
// Imported lazily to avoid circular dependency with HttpClient.
async function performLogout(): Promise<void> {
  addBreadcrumb('Auth session expired — clearing tokens and redirecting', 'auth');
  await TokenStorage.clearAll();
  // Notify the app to redirect to login.
  // We use a dynamic require to avoid a circular dependency between
  // AuthInterceptor → HttpClient → AuthInterceptor.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { store } = require('../../../state/store');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { logoutUser } = require('../../../state/slices/authSlice');
    store.dispatch(logoutUser());
  } catch {
    // If Redux store is not available (e.g. during bootstrap), skip dispatch
  }
}

// ── Request interceptors ───────────────────────────────────────────────────────

export async function authRequestInterceptor(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const { accessToken } = await TokenStorage.getTokens();

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}

export function requestErrorHandler(error: AxiosError): Promise<never> {
  return Promise.reject(error);
}

// ── Response interceptors ──────────────────────────────────────────────────────

export function responseInterceptor(response: AxiosResponse): AxiosResponse {
  return response;
}

/**
 * Handles 401 Unauthorized responses.
 *
 * Architecture:
 *   401 Response → AuthInterceptor
 *     ├─ isRefreshing=false → set true → attempt refresh → retry → set false
 *     └─ isRefreshing=true  → queue request → resolve/reject after refresh
 *     └─ refresh fails / no refresh token → logout → redirect login
 *
 * Graceful fallback: if REFRESH endpoint does not exist or returns an error,
 * the user is logged out cleanly. Refresh can be activated later by simply
 * confirming the backend endpoint is live — no code change needed.
 */
export async function responseErrorHandler(
  error: AxiosError
): Promise<AxiosResponse> {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  if (error.response?.status !== 401 || originalRequest._retry) {
    return Promise.reject(error);
  }

  // Check if a refresh token is available before attempting
  const refreshToken = await TokenStorage.getRefreshToken();
  if (!refreshToken) {
    addBreadcrumb('No refresh token available — triggering logout', 'auth');
    await performLogout();
    return Promise.reject(error);
  }

  // If another refresh is already in-flight, queue this request
  if (isRefreshing) {
    return new Promise<AxiosResponse>((resolve, reject) => {
      refreshQueue.push({
        resolve: (newToken: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          // Re-issue the original request with the new token
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { httpClient } = require('../HttpClient');
          resolve(httpClient.getAxiosInstance().request(originalRequest));
        },
        reject,
      });
    });
  }

  // This is the first 401 — take ownership of the refresh flow
  originalRequest._retry = true;
  isRefreshing = true;

  try {
    addBreadcrumb('Token refresh attempted', 'auth');

    // Dynamically import to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { authRepository } = require('../../repositories/AuthRepositoryImpl');
    const tokens = await authRepository.refreshToken(refreshToken);

    // Persist new tokens
    const { userId } = await TokenStorage.getTokens();
    await TokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken, userId ?? '');

    addBreadcrumb('Token refresh succeeded', 'auth');

    // Update Authorization header on the original request and retry
    if (originalRequest.headers) {
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    // Unblock all queued requests
    resolveQueue(tokens.accessToken);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { httpClient } = require('../HttpClient');
    return httpClient.getAxiosInstance().request(originalRequest);
  } catch (refreshError) {
    addBreadcrumb('Token refresh failed — triggering logout', 'auth');
    rejectQueue(refreshError);
    await performLogout();
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
}
