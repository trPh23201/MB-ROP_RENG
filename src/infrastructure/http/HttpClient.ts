import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HTTP_CONFIG } from './HttpConfig';
import { authRequestInterceptor, requestErrorHandler, responseErrorHandler, responseInterceptor } from './interceptors/AuthInterceptor';
import { addBreadcrumb } from '../services/monitoring';

class HttpClient {
  private static instance: HttpClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: HTTP_CONFIG.BASE_URL,
      timeout: HTTP_CONFIG.TIMEOUT,
      headers: HTTP_CONFIG.HEADERS,
    });

    this.setupInterceptors();
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private setupInterceptors(): void {
    // Auth interceptor: injects Bearer token + handles 401 refresh flow
    this.axiosInstance.interceptors.request.use(
      authRequestInterceptor,
      requestErrorHandler
    );

    this.axiosInstance.interceptors.response.use(
      responseInterceptor,
      responseErrorHandler
    );

    // Logging interceptor: Sentry breadcrumbs for request/response tracing
    this.axiosInstance.interceptors.request.use(this.logRequest, this.logError);
    this.axiosInstance.interceptors.response.use(this.logResponse, this.logError);
  }

  private logRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    addBreadcrumb(
      `API REQUEST ${config.method?.toUpperCase()} ${config.url}`,
      'http'
    );
    return config;
  };

  private logResponse = (response: AxiosResponse): AxiosResponse => {
    addBreadcrumb(
      `API RESPONSE ${response.status} ${response.config.url}`,
      'http'
    );
    return response;
  };

  private logError = (error: AxiosError): Promise<never> => {
    if (error.response) {
      addBreadcrumb(
        `API ERROR ${error.response.status} ${error.config?.url}`,
        'http'
      );
    } else if (error.request) {
      addBreadcrumb(
        `API ERROR — no response from ${error.config?.url}`,
        'http'
      );
    } else {
      addBreadcrumb(`API ERROR — request setup: ${error.message}`, 'http');
    }
    return Promise.reject(error);
  };

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  public async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  public async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  public async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const httpClient = HttpClient.getInstance();

export { HttpClient };
