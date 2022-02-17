import { makeObservable, observable, action, computed } from 'mobx';

import BaseRootStore from './BaseRootStore';
import { sendSentryError } from '../utils';

export default class BaseSubstore<RootStoreT = BaseRootStore> {
  rootStore: RootStoreT;

  loading = false;
  error = false;

  constructor(rootStore: RootStoreT) {
    this.rootStore = rootStore;

    makeObservable(this, {
      loading: observable,
      error: observable,

      setLoading: action,
      setError: action,
      sendSentryError: action,
    });
  }

  setLoading = (value: boolean): void => {
    this.loading = value;
  };

  setError = (value: boolean): void => {
    this.error = value;
  };

  // eslint-disable-next-line
  sendSentryError = (exception: any, params: Record<string, unknown>): void => {
    sendSentryError(exception, params);
  };
}
