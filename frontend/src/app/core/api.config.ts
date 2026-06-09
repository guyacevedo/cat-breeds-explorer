import { InjectionToken } from '@angular/core';

/**
 * Base URL for the backend REST API. Relative '/api' works both in dev
 * (via proxy.conf.json) and in production (nginx proxies /api -> backend).
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});
