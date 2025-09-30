import { logger as rnLogger, consoleTransport } from 'react-native-logs';

// Check if we're in development mode
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';

// Configure react-native-logs
const config = {
  severity: isDev ? 'debug' : 'error',
  transport: isDev ? [consoleTransport] : [],
  transportOptions: {
    colors: {
      info: 'blueBright' as const,
      warn: 'yellowBright' as const,
      error: 'redBright' as const,
      debug: 'magentaBright' as const,
    },
  },
  async: true,
  dateFormat: 'time' as const,
  printLevel: true,
  printDate: true,
  enabled: true,
};

// Create logger instance
const logger = rnLogger.createLogger(config);

// Create domain-specific loggers for better organization
export const createDomainLogger = (domain: string) => {
  return {
    debug: (message: string, data?: any) => {
      logger.debug(`[${domain}] ${message}`, data || '');
    },
    info: (message: string, data?: any) => {
      logger.info(`[${domain}] ${message}`, data || '');
    },
    warn: (message: string, data?: any) => {
      logger.warn(`[${domain}] ${message}`, data || '');
    },
    error: (message: string, error?: any) => {
      logger.error(`[${domain}] ${message}`, error || '');
    },
  };
};

// Export domain-specific loggers
export const onboardingLogger = createDomainLogger('ONBOARDING');
export const preferencesLogger = createDomainLogger('PREFERENCES');
export const authLogger = createDomainLogger('AUTH');

// Export main logger for general use
export { logger };
