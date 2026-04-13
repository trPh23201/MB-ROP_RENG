import * as Sentry from '@sentry/react-native';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.2,
    environment: __DEV__ ? 'development' : 'production',
    enabled: !__DEV__,
  });
};

export const captureError = (error: Error, context?: Record<string, unknown>) => {
  Sentry.captureException(error, { extra: context });
};

export const addBreadcrumb = (
  message: string,
  category?: string,
  data?: Record<string, unknown>,
) => {
  Sentry.addBreadcrumb({ message, category, data, level: 'info' });
};
