export type ApiSexType = 0 | 1 | 2; // 0 - пол не указан, 1 - женский пол, 2 - мужской пол

export type ApiFlagsType = Record<string, boolean>;

export type ApiBaseUserType = Record<string, unknown> & {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  sex?: ApiSexType | null;
  bdate?: string | null;
  country_id?: number | null;
  city_id?: number | null;
  added_from?: string | null;
  flags?: ApiFlagsType;
};

export type ApiBaseAuthType = Record<string, unknown> & {
  user: ApiBaseUserType;
};
