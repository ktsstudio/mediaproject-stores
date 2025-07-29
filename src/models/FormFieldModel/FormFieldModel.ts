import { action, computed, makeObservable, observable } from 'mobx';

import { ValueModel } from '../ValueModel';

import { FormFieldInitDataType, ValidatorType } from './types';

type ProtectedFields = '_error' | '_setError' | '_resetError';

export default class FormFieldModel<T = string> extends ValueModel<T> {
  protected readonly _validators: ValidatorType<T>[];

  protected _error: string | null = null;

  constructor(initData: FormFieldInitDataType<T>) {
    super(initData.value);

    this._validators = initData.validators;

    makeObservable<FormFieldModel<T>, ProtectedFields>(this, {
      _error: observable,

      error: computed,
      hasError: computed,

      _setError: action.bound,
      _resetError: action.bound,
    });
  }

  get error(): string | null {
    return this._error;
  }

  get hasError(): boolean {
    return this._error !== null;
  }

  setValue(value: T): void {
    super.setValue(value);

    if (value === this.value) {
      return;
    }

    this._resetError();
  }

  protected _setError(value: string): void {
    this._error = value;
  }

  protected _resetError(): void {
    this._error = null;
  }

  validate(): void {
    this._validators.some((validator) => {
      const error = validator(this.value);

      if (error) {
        this._setError(error);
      }

      return Boolean(error);
    });
  }

  reset(): void {
    super.reset();
    this._resetError();
  }
}
