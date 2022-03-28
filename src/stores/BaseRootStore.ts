import { makeObservable, observable, action, computed } from 'mobx';

import sendSentryError from '../utils/sendSentryError';

import { EndpointsType } from './types/stores';
import { ErrorsEnum, errors } from './error/errors';
import { ErrorDataType } from './error/types';

export default class BaseRootStore {
  _endpoints: EndpointsType;

  // перечисление кодов ошибок
  errorCodes: Record<string, string>;
  // список названий ошибок
  errorNames: Record<string, string>;
  // флаг, показывающий ошибку
  errorShown = false;
  // од ошиби
  error: string | null = null;

  fatalError = false;

  // снекбар ошибки
  errorPopup = null;

  // текст ошибки
  get errorText(): string | null {
    return this.error && this.errorNames?.[this.error]
      ? this.errorNames[this.error]
      : this.errorNames[this.errorCodes.default];
  }

  constructor(
    endpoints: EndpointsType,
    codes: Record<string, string>,
    names: Record<string, string>
  ) {
    this._endpoints = endpoints;

    this.errorCodes = { ...ErrorsEnum, ...codes };
    this.errorNames = { ...errors, ...names };

    makeObservable(this, {
      fatalError: observable,
      errorShown: observable,
      error: observable,
      errorPopup: observable,

      errorText: computed,
      setFatalError: action,
      showError: action,
      hideError: action,
      setError: action,
      eraseError: action,
      handleError: action,
    });
  }

  setFatalError = (value: boolean): void => {
    this.fatalError = value;
  };

  // показать попап ошибки
  setErrorPopup = (value: any): void => {
    this.errorPopup = value;
  };

  // показать попап ошибки
  showError = (): void => {
    this.errorShown = true;
  };

  // скрыть попап ошибки
  hideError = (): void => {
    this.errorShown = false;
  };

  // установить код ошибки
  setError = (value = '', setAndShow = true): void => {
    this.error = value || this.errorCodes.default;

    if (setAndShow) {
      this.showError();
    }
  };

  // очистить ошибку
  eraseError = (): void => {
    this.error = null;
    this.hideError();
    this.setErrorPopup(null);
  };

  // установка ошибки и передача в сентри
  handleError = ({
    response,
    error,
    errorData,
    url,
    params,
    extra = {},
    showError = true,
    isDev = false,
  }: ErrorDataType): void => {
    let errCode = errorData?.code;
    if (!response && !errorData && error) {
      errCode = ErrorsEnum.networkError;
    }

    this.setError(errCode, showError);

    sendSentryError({ error, errorData, url, params, extra, isDev });
  };
}
