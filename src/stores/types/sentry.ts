export type SentryTagType = 'api' | 'vk_bridge' | 'render' | 'custom';

export type SentryUserConfigType = {
  id: string;
  [key: string]: any;
};

export type SentryVKUserConfigType = SentryUserConfigType & {
  platform: string;
  odr: boolean;
};

export type SentryInitConfigType = {
  dsn?: string;
  normalizeDepth: number;
  userConfig?: SentryUserConfigType | SentryVKUserConfigType;
};
