export interface MockAxiosConfig {
  url: string;
  method?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  responseType?: string;
}

export interface MockAxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: MockAxiosConfig;
}

export const createMockResponse = <T>(data: T, config: Partial<MockAxiosConfig> = {}): MockAxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    url: 'mock-url',
    method: 'GET',
    ...config
  }
});