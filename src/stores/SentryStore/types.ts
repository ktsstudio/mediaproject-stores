import { ScopeContext, CaptureContext } from '@sentry/core';

type APIErrorDataType = {
  code: string;
  message: string;
  status: string;
};

// client_error — ошибки, возникающие на клиенте
// api_error — ошибки API
// auth_error — ошибки авторизации
type VKBridgeErrorDataType =
  | {
      error_type: 'client_error';
      error_data: {
        error_code: number;
        error_reason: string;
        error_description?: string;
      };
    }
  | {
      error_type: 'api_error';
      error_data: {
        error_code: number;
        error_msg: string;
        request_params?: string[];
      };
    }
  | {
      error_type: 'auth_error';
      error_data: {
        error: number;
        error_reason: string;
        error_description?: string[];
      };
    };

type VKBridgeErrorEventType = {
  type: string;
  data: VKBridgeErrorDataType;
};

type ExceptionType<E = any> = {
  error: E;
  context?: CaptureContext;
};

type CustomExceptionType<E = any> = Omit<ExceptionType<E>, 'context'> & {
  type: 'render' | 'api' | 'vk_bridge' | 'fapi' | string;
  context?: Partial<ScopeContext>;
};

type RenderExceptionType<E = any> = Omit<CustomExceptionType<E>, 'type'> & {
  errorInfo: any;
};

type APIExceptionType<ED = APIErrorDataType, E = any> = Omit<
  CustomExceptionType<E>,
  'type'
> & {
  errorData: ED;
  url: string;
  payload?: Record<string, any>;
};

type VKBridgeExceptionType<E = any> = Omit<CustomExceptionType<E>, 'type'> & {
  error: VKBridgeErrorEventType;
  url: string;
  payload?: Record<string, any>;
};

type FAPIExceptionType<E = any> = Omit<CustomExceptionType<E>, 'type'> & {
  url: string;
  fields?: string;
  status: string;
  data?: any;
};

export {
  APIErrorDataType,
  VKBridgeErrorDataType,
  VKBridgeErrorEventType,
  ExceptionType,
  CustomExceptionType,
  RenderExceptionType,
  APIExceptionType,
  VKBridgeExceptionType,
  FAPIExceptionType,
};
