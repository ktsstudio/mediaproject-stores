export type ValidatorType<T> = (value: T) => string | null;

export type FormFieldInitDataType<T> = {
  value: T;
  validators: ValidatorType<T>[];
};
