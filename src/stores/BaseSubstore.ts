import { makeObservable, observable, action, computed } from 'mobx';
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

      shouldSendSentryError: computed,

      setLoading: action,
      setError: action,
      sendSentryError: action,
    });
  }

  get shouldSendSentryError(): boolean {
    return Boolean(!window.is_dev && Sentry.getCurrentHub().getClient());
  }

  setLoading = (value: boolean): void => {
    this.loading = value;
  };

  setError = (value: boolean): void => {
    this.error = value;
  };

  // eslint-disable-next-line
  sendSentryError = (exception: any, params: Record<string, unknown>): void => {
    if (this.shouldSendSentryError) {
      try {
        Sentry.captureException(exception, params);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  };
}
