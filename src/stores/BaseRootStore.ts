import { makeObservable, observable, action } from 'mobx';

import SentryStore from './SentryStore';
import { EndpointsType } from './types/stores';

export default class BaseRootStore {
  _endpoints: EndpointsType;
  sentryStore?: SentryStore;

  fatalError = false;

  constructor(endpoints: EndpointsType, sentryStore?: SentryStore) {
    this._endpoints = endpoints;
    this.sentryStore = sentryStore;

    makeObservable(this, {
      fatalError: observable,
      setFatalError: action,
    });
  }

  setFatalError = (value: boolean): void => {
    this.fatalError = value;
  };
}
