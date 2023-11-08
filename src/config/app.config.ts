import { registerAs } from '@nestjs/config';
import * as path from 'path';

function parseLogLevel(level: string | undefined): string[] {
  if (!level) {
    return ['log', 'error', 'warn', 'debug', 'verbose'];
  }

  if (level === 'none') {
    return [];
  }

  return level.split(',');
}

export default registerAs('app', () => ({
  port: process.env.APP_PORT || 5000,
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  loggerLevel: parseLogLevel(
    process.env.APP_LOGGER_LEVEL || 'log,error,warn,debug,verbose',
  ),
  env: process.env.NODE_ENV || 'dev',

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require(path.join(process.cwd(), 'package.json')).version,
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  workingDirectory: process.env.PWD || process.cwd(),
  frontendDomain: process.env.FRONTEND_DOMAIN,
  backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
  apiPrefix: process.env.API_PREFIX || 'api',
  fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
  headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
}));
