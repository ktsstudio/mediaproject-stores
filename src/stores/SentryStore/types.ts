import { EndpointType } from '../../types';

enum SentryTagEnum {
  api = 'api',
  vkBridge = 'vk_bridge',
  render = 'render',
  custom = 'custom',
}

type SentryUserType = {
  id: string;
  [key: string]: any;
};

type SentryConfigType = {
  dsn?: string;
  normalizeDepth: number;
  user?: SentryUserType;
};

type ApiErrorDataType = {
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

type ExceptionType<T> = {
  error: T;
  extra?: Record<string, any>;
  type: SentryTagEnum;
};

type RenderExceptionType<T> = {
  error: T;
  extra?: Record<string, any>;
};

type ApiExceptionType<T, ED> = {
  error: T;
  errorData: ED;
  endpoint: EndpointType;
  payload?: Record<string, any>;
};

type VKBridgeExceptionType = {
  errorEvent: VKBridgeErrorEventType;
  url: string;
  payload?: Record<string, any>;
};

export {
  SentryTagEnum,
  SentryUserType,
  SentryConfigType,
  ApiErrorDataType,
  VKBridgeErrorDataType,
  VKBridgeErrorEventType,
  ExceptionType,
  RenderExceptionType,
  ApiExceptionType,
  VKBridgeExceptionType,
};
