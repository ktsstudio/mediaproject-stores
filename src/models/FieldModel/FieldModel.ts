import { action, computed, makeObservable, observable } from 'mobx';

import { FormFieldInitDataType, ValidatorType } from './types';

type PrivateFields =
  | '_value'
  | '_error'
  | '_setError'
  | '_resetError'
  | '_touched'
  | '_resetTouched';

export default class FormFieldModel<T = string> {
  private readonly _validators: ValidatorType<T>[];

  private _value: T;
  private _touched = false;
  protected _initialValue: T;

  private _error: string | null = null;

  constructor(initData: FormFieldInitDataType<T>) {
    this._value = initData.value;
    this._initialValue = initData.value;
    this._validators = initData.validators;

    makeObservable<FormFieldModel<T>, PrivateFields>(this, {
      _value: observable,
      _error: observable,
      _touched: observable,

      value: computed,
      error: computed,
      hasError: computed,
      isEmpty: computed,
      touched: computed,

      setValue: action.bound,
      reset: action.bound,
      _setError: action.bound,
      _resetError: action.bound,
      _resetTouched: action.bound,
    });
  }

  get value(): T {
    return this._value;
  }

  get error(): string | null {
    return this._error;
  }

  get hasError(): boolean {
    return this._error !== null;
  }

  get touched(): boolean {
    return this._touched;
  }

  get isEmpty(): boolean {
    return !this._value;
  }

  setValue(value: T): void {
    if (value === this._value) {
      return;
    }

    this._value = value;
    this._resetError();
    this._touched = true;
  }

  private _setError(value: string): void {
    this._error = value;
  }

  _resetTouched = (): void => {
    this._touched = false;
  };

  private _resetError(): void {
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

  reset = (): void => {
    this.setValue(this._initialValue);
    this._resetTouched();
    this._resetError();
  };
}
