export interface IList<T, K extends string | number | symbol = string> {
  get keys(): K[];
  get entities(): Record<K, T>;
  get items(): Array<T>;
  get length(): number;

  getEntityByKey(key: K): T | null;
  getEntityByIndex(index: number): T;
  getEntityAndIndex(key: K): { item: T; index: number } | null;

  addEntity(params: { entity: T; isToStart?: boolean }): void;
  addEntities({
    entities,
    isInitial,
    isToStart,
  }: {
    entities: T[];
    isInitial?: boolean;
    isToStart?: boolean;
  }): void;

  removeEntity(param: K): void;
  removeEntities(params: K[]): void;

  toStart(key: K): void;
  reset(): void;
}
