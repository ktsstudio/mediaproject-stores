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
}