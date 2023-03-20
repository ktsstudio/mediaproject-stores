import { action, makeObservable, override } from 'mobx';

import { ApiListModel } from '../ApiListModel';
import { ResponseApiType } from '../ApiListModel/types';

import { SLEEP_MS_DEFAULT } from './config';
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
 * @param {number} [limitCountPerRequest] - Количество элементов, которое нужно загрузить с сервера за один запрос.
 * @param {number} [sleepMs] - Время в миллисекундах, которое нужно подождать перед тем, как вернуть данные.
 * @param {number} [listLengthLimit] - Максимальная длина всего списка, который будет сгенерирован. Если не указано, то будет генерироваться бесконечный список.
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
 *    id: faker.datatype.uuid(),
 *    text: faker.lorem.paragraph(),
 *   })),
 *  });,
 * });
 */
class MockApiListModel<T, ApiT = T, RestApiT = undefined> extends ApiListModel<
  T,
  RestApiT
> {
  private _listLengthLimit?: number;
  private _sleepMs: number;

  constructor({
    sleepMs = SLEEP_MS_DEFAULT,
    listLengthLimit,
    ...props
  }: MockApiListModelProps<T, RestApiT>) {
    super(props);

    this._sleepMs = sleepMs;
    this._listLengthLimit = listLengthLimit;

    makeObservable<
      MockApiListModel<T, ApiT, RestApiT>,
      MockApiListModelPrivateFields
    >(this, {
      _listLengthLimit: false,
      _sleepMs: false,
      _sleep: action,
      _buildLimitedResponse: action,

      load: override,
      refresh: override,
      reset: override,
    });
  }

  private _sleep(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this._sleepMs));
  }

  private _buildLimitedResponse(
    result: ResponseApiType<T, RestApiT>,
    listLengthLimit: number
  ): ResponseApiType<T, RestApiT> {
    const restApiData = 'restApiData' in result ? result.restApiData : {};

    const limitedResult = {
      apiList: result.list.slice(0, listLengthLimit - this.list.length),
      ...restApiData,
    };

    return limitedResult as unknown as ResponseApiType<T, RestApiT>;
  }

  public override async load(): Promise<RestApiT | undefined> {
    if (this.listLoaded || this.meta.isLoading) {
      return;
    }

    this.meta.setLoadedStartMeta();

    try {
      await this._sleep();
      const result = await this.fetchFunction(this);

      const isLimited =
        this._listLengthLimit &&
        this.list.length + result.list.length >= this._listLengthLimit;

      if (this._listLengthLimit && isLimited) {
        const limitedResult = this._buildLimitedResponse(
          result,
          this._listLengthLimit
        );

        return this._setFetchResult(limitedResult);
      }

      return this._setFetchResult(result);
    } catch (error) {
      this.meta.setLoadedErrorMeta();
    }
  }

  public override async refresh(): Promise<RestApiT | undefined> {
    this.reset();

    const restApiData = await this.load();

    return restApiData;
  }
}

export default MockApiListModel;
