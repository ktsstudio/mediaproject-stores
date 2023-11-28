import { action, computed, makeObservable, observable } from 'mobx';

import { IList } from './types';

type ListModelPrivateFields = '_keys' | '_entities';

/**
 * Модель для работы со списками однотипных данных
 *
 * @implements {IList<T, K>}
 * T - тип данных элемента исходного списка.
 * K - типа данных идентификатора (ключа) каждого элемента.
 *
 * @param {T[]} items Исходный список элементов типа T
 * @param {(item: T) => K} getKeyForItem Функция, принимающая элемент списка, и возвращающая его идентификатор
 */
class ListModel<T, K extends string | number = string> implements IList<T, K> {
  private _keys: K[] = [];
  private _entities: Record<K, T> = {} as Record<K, T>;
  private readonly _getKeyForItem: (item: T) => K;

  constructor(items: T[], getKeyForItem: (item: T) => K) {
    this._getKeyForItem = getKeyForItem;

    this._normalize(items);

    makeObservable<ListModel<T, K>, ListModelPrivateFields>(this, {
      _keys: observable,
      _entities: observable,

      keys: computed,
      entities: computed,
      length: computed,
      items: computed,

      addEntity: action.bound,
      addEntities: action.bound,
      removeEntity: action.bound,
      removeEntities: action.bound,
      toStart: action.bound,
      reset: action.bound,
    });
  }

  private _normalize(items: T[]) {
    items.forEach((item) => {
      const key = this._getKeyForItem(item);

      this._keys.push(key);
      this._entities[key] = item;
    });
  }

  /** Возвращает список ключей (идентификаторов) */
  get keys(): K[] {
    return this._keys;
  }

  /**
   * Возвращает объект, в котором ключ типа К является идентификатором
   * и значение типа Т является элементом исходного списка
   */
  get entities(): Record<K, T> {
    return this._entities;
  }

  /** Возвращает список элементов типа T */
  get items(): T[] {
    return this._keys.reduce((acc: T[], id: K) => {
      const item = this._entities[id];

      return item ? [...acc, item] : acc;
    }, []);
  }

  /** Возвращает количество элементов */
  get length(): number {
    return this.items.length;
  }

  /**
   * Получает элемент типа T по его идентификатору (ключу) типа K.
   * Если элемент не найден, возвращает null.
   */
  getEntityByKey(key: K): T | null {
    if (!this._entities[key]) {
      return null;
    }

    return this._entities[key];
  }

  /** Получает элемент типа T по его индексу */
  getEntityByIndex(index: number): T | null {
    const id = this.keys[index];

    return this.getEntityByKey(id);
  }

  /**
   * По ключу типа K получает объект, содержащий элемент типа T и его индекс.
   * Если такого ключа нет, возвращает null.
   */
  getEntityAndIndex(key: K): { item: T; index: number } | null {
    const index = this.keys.indexOf(key);

    if (index === -1) {
      return null;
    }

    const item = this.items[index];

    return item ? { item, index } : null;
  }

  /**
   * Добавляет новую запись.
   * Если идентификатор новой записи уже существует, то запись с этим ключом перезаписывается.
   * @param {boolean} isToStart Помещать новую запись в начало списка?
   */
  addEntity({ entity, isToStart }: { entity: T; isToStart?: boolean }): void {
    const key = this._getKeyForItem(entity);

    this._entities[key] = entity;

    if (this._keys.includes(key)) {
      return;
    }

    if (isToStart) {
      this._keys.unshift(key);
    } else {
      this._keys.push(key);
    }
  }

  /**
   * Добавляет несколько новых записей
   * @param {Object} param
   * @param {boolean} param.isInitial Затереть текущие записи новыми?
   * @param {boolean} param.isToStart Поместить новые записи в начало?
   */
  addEntities({
    entities,
    isInitial,
    isToStart,
  }: {
    entities: T[];
    isInitial?: boolean;
    isToStart?: boolean;
  }): void {
    if (isInitial) {
      this.reset();
      this._normalize(entities);

      return;
    }

    const newEntities = isToStart ? entities.reverse() : entities;

    newEntities.forEach((entity) => {
      this.addEntity({ entity, isToStart });
    });
  }

  /** Удаляет запись с ключом keyParam */
  removeEntity(keyParam: K): void {
    this._keys = this._keys.filter((key) => key !== keyParam);
    delete this._entities[keyParam];
  }

  /** Удаляет несколько записей, которые имеют ключи keys */
  removeEntities(keys: K[]): void {
    keys.forEach(this.removeEntity);
  }

  /** Перемещает запись с ключом key в начало списка */
  toStart(key: K): void {
    const foundIndex = this.keys.indexOf(key);

    if (foundIndex === -1) {
      return;
    }

    this.keys.splice(foundIndex, 1);
    this.keys.splice(0, 0, key);
  }

  /** Очищает модель */
  reset(): void {
    this._keys = [];
    this._entities = {} as Record<K, T>;
  }
}

export default ListModel;
