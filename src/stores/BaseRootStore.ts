import { UrlsType } from './types/stores';

export default class BaseRootStore {
  _urls: UrlsType;

  constructor(urls: UrlsType) {
    this._urls = urls;
  }
}
