import { action, computed, makeObservable, observable } from 'mobx';

import { IField } from './types';

class FieldModel<T = string> implements IField<T> {
  private _value: T;
  private readonly _initialValue: T;

  constructor(value: T, config?: { initialValue: T }) {
    this._value = value;
    this._initialValue = config?.initialValue ?? value;

    makeObservable<FieldModel<T>, '_value'>(this, {
      _value: observable.ref,

      value: computed,

      changeValue: action.bound,
      reset: action.bound,
    });
  }

  get value(): T {
    return this._value;
  }

  changeValue<I extends T>(value: I): I {
    this._value = value;

    return value;
  }

  reset(): void {
    this._value = this._initialValue;
  }
}

export default FieldModel;
