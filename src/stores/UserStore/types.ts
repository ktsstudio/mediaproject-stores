type UserStorePrivateFields = '_user' | '_flags' | '_messagesAllowed';

type FlagsType = Record<string, boolean>;

type SexType = 0 | 1 | 2; // 0 - пол не указан, 1 - женский пол, 2 - мужской пол

type ApiUserType = {
  id: number;
  first_name?: string;
  last_name?: string;
  sex?: SexType;
  bdate?: string;
  country_id?: number;
  city_id?: number;
  flags?: FlagsType;
};

type ApiGetUserType<UserT = ApiUserType> = {
  user: UserT;
};

type ApiAuthType<UserT = ApiUserType> = ApiGetUserType<UserT> & {
  messages_allowed?: boolean;
};

type FlagParamsType = {
  name: string;
  value: boolean;
  withLoadingCheck?: boolean;
};

export {
  SexType,
  UserStorePrivateFields,
  ApiUserType,
  ApiGetUserType,
  ApiAuthType,
  FlagsType,
  FlagParamsType,
};
