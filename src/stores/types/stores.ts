import { Method } from 'axios';

// urls
export type UrlTuple = [string, Method];

export type UrlsType = Record<string, UrlTuple> & {
  auth: UrlTuple;
  getUser?: UrlTuple;
  flag?: UrlTuple;
};
