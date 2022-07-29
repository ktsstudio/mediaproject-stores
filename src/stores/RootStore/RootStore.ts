import { EndpointsType } from './types';

class RootStore {
  private readonly _endpoints: EndpointsType;

  constructor(endpoints: EndpointsType) {
    this._endpoints = endpoints;
  }

  get endpoints(): EndpointsType {
    return this._endpoints;
  }
}

export default RootStore;
