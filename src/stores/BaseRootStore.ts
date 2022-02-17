import { makeObservable, observable, action } from 'mobx';

import { EndpointsType } from './types/stores';

export default class BaseRootStore {
  _endpoints: EndpointsType;
  fatalError = false;

  constructor(endpoints: EndpointsType) {
    this._endpoints = endpoints;

    makeObservable(this, {
      fatalError: observable,
      setFatalError: action,
    });
  }

  setFatalError = (value: boolean): void => {
    this.fatalError = value;
  };
}
