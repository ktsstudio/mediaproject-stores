import { makeObservable, observable, action } from 'mobx';

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
    });
  }

  setLoading = (value: boolean): void => {
    this.loading = value;
  };

  setError = (value: boolean): void => {
    this.error = value;
  };
}
