export type ApiSexType = 0 | 1 | 2;

export type ApiBaseUserType = Record<string, unknown> & {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  sex?: ApiSexType | null;
  bdate?: string | null;
  country_id?: number | null;
  city_id?: number | null;
  added_from?: string | null;
  created_dt: string;
  updated_dt: string;
  flags?: Record<string, boolean>;
};

export type ApiBaseAuthType = Record<string, unknown> & {
  user: ApiBaseUserType;
};
