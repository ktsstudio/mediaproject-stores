import { action, computed, makeObservable, observable } from 'mobx';

import { IMetaModel } from './types';

type MetaModelPrivateFields = '_isLoading' | '_isError' | '_isLoaded';

class MetaModel implements IMetaModel {
  private _isLoading: boolean;
  private _isError: boolean;
  private _isLoaded: boolean;

  constructor() {
    this._isError = false;
    this._isLoading = false;
    this._isLoaded = false;

    makeObservable<MetaModel, MetaModelPrivateFields>(this, {
      _isError: observable,
      _isLoading: observable,
      _isLoaded: observable,

      isLoading: computed,
      isError: computed,
      isLoaded: computed,

      isInitialMetaState: computed,

      setLoadedStartMeta: action.bound,
      setLoadedSuccessMeta: action.bound,
      setLoadedErrorMeta: action.bound,

      reset: action.bound,
    });
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get isError(): boolean {
    return this._isError;
  }

  get isInitialMetaState(): boolean {
    return !this.isLoading && !this.isLoaded && !this.isError;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  reset(): void {
    this._isLoading = false;
    this._isError = false;
    this._isLoaded = false;
  }

  setLoadedStartMeta(): void {
    this._isLoading = true;
    this._isError = false;
    this._isLoaded = false;
  }

  setLoadedSuccessMeta(): void {
    this._isLoading = false;
    this._isError = false;
    this._isLoaded = true;
  }

  setLoadedErrorMeta(): void {
    this._isError = true;
    this._isLoading = false;
    this._isLoaded = false;
  }
}

export default MetaModel;
