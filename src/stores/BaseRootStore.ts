import { EndpointsType } from './types/stores';

export default class BaseRootStore {
  _endpoints: EndpointsType;

  constructor(endpoints: EndpointsType) {
    this._endpoints = endpoints;
  }
}
