import { checkDev } from '@ktsstudio/mediaproject-utils';
import { makeObservable, observable } from 'mobx';

export class AppParamsStore {
  search: string;
  locationHash: string;
  isProd: boolean;
  isDev: boolean;

  constructor() {
    this.search = location.search;
    this.locationHash = location.hash;
    this.isProd = process.env.NODE_ENV === 'production';
    this.isDev = checkDev(this.isProd); // @ktsstudio/mediaproject-utils >= 5.0.0

    makeObservable<AppParamsStore>(this, {
      search: observable,
      locationHash: observable,
      isProd: observable,
      isDev: observable,
    });
  }
}

export const appParamsStore = new AppParamsStore();
