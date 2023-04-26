import { makeObservable, override } from 'mobx';

import { ApiListModel } from '../ApiListModel';

import { SLEEP_TIMEOUT_DEFAULT } from './config';
import { MockApiListModelProps, MockApiListModelPrivateFields } from './types';

/**
 * MockApiListModel<T, RestApiT>
 *
 * @description
 * Модель расширяет ApiListModel, добавляя возможность работы с мокапами.
 *
 * @extends {ApiListModel<T, RestApiT>}
 * T - Тип данных, которые будут храниться в модели.
 * RestApiT - Тип данных, которые приходят с сервера, в случае, если нужно вернуть какие-то данные, которые не относятся к списку. По-умолчанию undefined.
 *
 * @param {ApiListFetchFunction<T, RestApiT>} fetchFunction - Callback-функция для генерации мокапов.
 * @param {number} limitCountPerRequest - Количество элементов, которое нужно загрузить с сервера за один запрос.
 * @param {number} sleepTimeoutMs - Время в миллисекундах, которое нужно подождать перед тем, как вернуть данные.
 * @param {number} listLengthLimit - Максимальная длина всего списка, который будет сгенерирован. Если не указано, то будет генерироваться бесконечный список.
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
 * @example
 * import { ApiListModel } from 'mediaproject-stores';
 * import { ArticleType } from './types';
 *
 * const mockArticlesListModel = new MockApiListModel<ArticleType>({
 *  fetchFunction: async ({ limitCountPerRequest }) => {
 *   return {
 *    apiList: Array.from({ length: limitCountPerRequest }, () => ({
 *      id: faker.datatype.uuid(),
 *      text: faker.lorem.paragraph(),
 *   })),
 *  });,
 * });
 */
class MockApiListModel<T, RestApiT = undefined> extends ApiListModel<
  T,
  RestApiT
> {
  private _listLengthLimit?: number;
  private readonly _sleepTimeoutMs: number;

  constructor({
    sleepTimeoutMs = SLEEP_TIMEOUT_DEFAULT,
    listLengthLimit,
    ...props
  }: MockApiListModelProps<T, RestApiT>) {
    super(props);

    this._sleepTimeoutMs = sleepTimeoutMs;
    this._listLengthLimit = listLengthLimit;

    makeObservable<this, MockApiListModelPrivateFields>(this, {
      _listLengthLimit: false,
      _sleepTimeoutMs: false,
      _sleep: false,

      load: override,
      reset: override,
    });
  }

  private _sleep(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this._sleepTimeoutMs));
  }

  public override async load(): Promise<RestApiT | undefined> {
    if (this.listLoaded || this.meta.isLoading) {
      return;
    }

    this.meta.setLoadedStartMeta();

    try {
      await this._sleep();
      const result = await this.fetchFunction(this);

      if (result.list === null) {
        this.meta.setLoadedErrorMeta();
      } else {
        this._setLimitedResult(result.list, this._listLengthLimit);

        this.meta.setLoadedSuccessMeta();
      }

      return this._getResultRestApiData(result);
    } catch (error) {
      this.meta.setLoadedErrorMeta();
    }
  }

  protected _setLimitedResult(list: T[], listLengthLimit?: number) {
    const isLimited =
      listLengthLimit !== undefined &&
      this.list.length + list.length >= listLengthLimit;

    if (isLimited) {
      const limitedResultList = list.slice(
        0,
        listLengthLimit - this.list.length
      );

      this._setFetchResult(limitedResultList);
    } else {
      this._setFetchResult(list);
    }
  }
}

export default MockApiListModel;
