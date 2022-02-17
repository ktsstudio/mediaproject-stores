import { makeObservable, observable, action } from 'mobx';
import * as Sentry from '@sentry/react';

import BaseRootStore from './BaseRootStore';

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

  sendSentryError = (exception: any, params: Record<string, unknown>): void => {
    this.setError(true);

    if (!window.is_dev) {
      try {
        Sentry.captureException(exception, params);
      } catch (error) {
        console.error(error);
      }
    }
  };
}