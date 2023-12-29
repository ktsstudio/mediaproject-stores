export interface IField<T = string> {
  get value(): T;

  changeValue(value: T): void;
  reset(): void;
}
