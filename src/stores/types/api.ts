export type ApiSexType = 0 | 1 | 2; // 0 - пол не указан, 1 - женский пол, 2 - мужской пол

export type ApiFlagsType = Record<string, boolean>;

export type ApiBaseUserType = Record<string, unknown> & {
  id: number;
  first_name?: string;
  last_name?: string;
  sex?: ApiSexType;
  bdate?: string;
  country_id?: number;
  city_id?: number;
  flags?: ApiFlagsType;
};

export type ApiBaseAuthType<UserT = ApiBaseUserType> = Record<
  string,
  unknown
> & {
  user: UserT;
  messages_allowed?: boolean;
};

export type ApiBaseGetUserType<UserT = ApiBaseUserType> = {
  user: UserT;
};

export type ApiErrorDataType = {
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

export type VKBridgeErrorEventType = {
  type: string;
  data: VKBridgeErrorDataType;
};
