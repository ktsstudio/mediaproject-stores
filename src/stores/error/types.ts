export type SentryDataType = {
  error: any;
  errorData: any;
  url: string;
  params?: any;
  extra?: Record<string, unknown>;
  isDev?: boolean;
};

export type ErrorDataType = {
  response: any;
  showError: boolean;
} & SentryDataType;
