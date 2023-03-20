import { action, computed, makeObservable, observable } from 'mobx';

import { MetaModel } from '../../MetaModel';

import { LIMIT_PER_REQUEST_DEFAULT } from './config';
import {
  ApiListModelPrivateFields,
  ApiListFetchFunction,
  ApiListModelProps,
  IApiListModel,
  ResponseApiType,
  ApiListFetchProps,
} from './types';

/**
 * ApiListModel<T, RestApiT>
 *
 * @description
 *  Модель предназначена для работы со списками, которые загружаются с сервера.
 *  Предоставляет методы для загрузки данных с сервера с оффсетом или пагинацией, контроля состояния загрузки, сброса данных.
 *  При достижении конца списка, модель устанавливает флаг, что список загружен.
 *
 * @implements {ApiListFetchProps<T, RestApiT>}
 *  T - Тип данных, которые будут храниться в модели.
 *  RestApiT - Тип данных, которые приходят с сервера, в случае, если нужно вернуть какие-то данные, которые не относятся к списку. По-умолчанию undefined.
 *
 * @param {ApiListFetchFunction<T, RestApiT>} fetchFunction - Callback-функция для загрузки данных с сервера. При вызове функции, в неё передаётся объект fetchProps: ApiListFetchProps.
 * @param {number} [limitPerRequest] - Количество элементов, которое нужно загрузить с сервера за один запрос.
 *
 * @method
 * @name load - Загрузить данные с сервера.
 *
 * @method
 * @name refresh - Сбросить данные и загрузить заново.
 *
 * @method
 * @name reset - Сбросить данные.
 *
 * @getter {list} - Список данных с типом <T>.
 * @getter {listLoaded} - Флаг, что список загружен полностью.
 * @getter {meta} - Мета-данные с асинхронными состояниями загрузки данных.
 * @getter {fetchProps} - Свойства, которые передаются в функцию fetchFunction.
 *
 * @example
 * import { ApiListModel } from 'mediaproject-stores';
 * import { ArtcileType } from './types';
 *
 * const articlesListModel = new ApiListModel<ArtcileType>({
 *  fetchFunction: fetchArticles,
 *  limitPerRequest: 10,
 * });
 *
 * const fetchArticles: ApiListFetchFunction<ArtcileType> = async (fetchProps) => {
 *   const { listLength, limitCountPerRequest } = fetchProps;
 *   const response = await fetch(`/api/list?offset=${listLength}&limit=${limitCountPerRequest}`);
 *   const apiList = await response.json();
 *   return { list: apiList.map(normalizer) };
 * };
 */
class ApiListModel<T, RestApiT = undefined>
  implements IApiListModel<T, RestApiT>
{
  private _list: T[] = [];

  private _fetchFunction: ApiListFetchFunction<T, RestApiT>;

  private _listLoaded = false;

  private readonly _limitCountPerRequest: number;

  private _meta: MetaModel = new MetaModel();

  constructor({
    fetchFunction,
    limitPerRequest = LIMIT_PER_REQUEST_DEFAULT,
  }: ApiListModelProps<T, RestApiT>) {
    this._fetchFunction = fetchFunction;
    this._limitCountPerRequest = limitPerRequest;

    makeObservable<ApiListModel<T, RestApiT>, ApiListModelPrivateFields>(this, {
      _list: observable.ref,
      _listLoaded: observable.ref,
      _meta: observable.ref,
      _limitCountPerRequest: false,
      _fetchFunction: action,
      _setFetchResult: action,
      _appendList: action,
      _checkListLoaded: action,

      list: computed,
      listLoaded: computed,
      listLength: computed,
      empty: computed,
      meta: computed,
      fetchProps: computed,
      limitCountPerRequest: computed,
      lastItem: computed,
      lastItemId: computed,
      currentPage: computed,

      load: action.bound,
      refresh: action.bound,
      reset: action.bound,
    });
  }

  public async load(): Promise<RestApiT | undefined> {
    if (this.listLoaded || this.meta.isLoading) {
      return;
    }

    this.meta.setLoadedStartMeta();

    try {
      const result = await this._fetchFunction(this);

      return this._setFetchResult(result);
    } catch (error) {
      this.meta.setLoadedErrorMeta();
    }
  }

  public async refresh(): Promise<RestApiT | undefined> {
    this.reset();

    const restApiData = await this.load();

    return restApiData;
  }

  public reset(): void {
    this.meta.reset();
    this._list = [];
    this._listLoaded = false;
  }

  public get list(): T[] {
    return this._list;
  }

  public get listLoaded(): boolean {
    return this._listLoaded;
  }

  public get listLength(): number {
    return this._list.length;
  }

  public get empty(): boolean {
    return this.listLength === 0;
  }

  public get meta(): MetaModel {
    return this._meta;
  }

  public get fetchProps(): ApiListFetchProps {
    return {
      listLength: this.listLength,
      listLoaded: this.listLoaded,
      limitCountPerRequest: this.limitCountPerRequest,
      empty: this.empty,
      lastItem: this.lastItem,
      lastItemId: this.lastItemId,
      currentPage: this.currentPage,
    };
  }

  public get limitCountPerRequest(): number {
    return this._limitCountPerRequest;
  }

  public get lastItem(): T | undefined {
    return this._list[this.listLength - 1];
  }

  public get lastItemId(): string | undefined {
    const { lastItem } = this;

    if (lastItem && typeof lastItem === 'object' && 'id' in lastItem) {
      const lastItemWithId = lastItem as T & { id: string };
      return lastItemWithId.id;
    }
  }

  public get currentPage(): number {
    return this.listLength / this.limitCountPerRequest;
  }

  protected get fetchFunction(): ApiListFetchFunction<T, RestApiT> {
    return this._fetchFunction;
  }

  private _appendList(list: T[]): void {
    this._list = [...this._list, ...list];
  }

  private _checkListLoaded(apiListResponse: T[]): void {
    if (apiListResponse.length < this.limitCountPerRequest) {
      this._listLoaded = true;
    }
  }

  protected _setFetchResult(result: ResponseApiType<T, RestApiT>) {
    const { list } = result;
    const restApiData =
      'restApiData' in result ? result.restApiData : undefined;

    this._checkListLoaded(list);
    this._appendList(list);

    this.meta.setLoadedSuccessMeta();

    return restApiData;
  }
}

export default ApiListModel;
