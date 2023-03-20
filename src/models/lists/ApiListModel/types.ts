import { IMetaModel } from '../../MetaModel/types';

import ApiListModel from './ApiListModel';

export type ApiListModelPrivateFields =
  | '_list'
  | '_listLoaded'
  | '_meta'
  | '_limitCountPerRequest'
  | '_fetchFunction'
  | '_setFetchResult'
  | '_appendList'
  | '_checkListLoaded';

export interface ApiListFetchProps {
  listLength: number;
  listLoaded: boolean;
  limitCountPerRequest: number;
  empty: boolean;
  lastItem: unknown;
  lastItemId: string | undefined;
  currentPage: number;
}

export interface IApiListModel<T, RestApiT> extends ApiListFetchProps {
  list: T[];
  meta: IMetaModel;

  load(): Promise<RestApiT | undefined>;
  refresh(): Promise<RestApiT | undefined>;
  reset(): void;
}

export type ResponseApiListType<T> = {
  list: T[];
};

export type ResponseRestApiType<RestApiT> = {
  restApiData: RestApiT;
};

export type ResponseApiType<T, RestApiT> = RestApiT extends undefined
  ? ResponseApiListType<T>
  : ResponseApiListType<T> & ResponseRestApiType<RestApiT>;

export type ApiListFetchFunction<T, RestApiT = undefined> = (
  model: ApiListModel<T, RestApiT>
) => Promise<ResponseApiType<T, RestApiT>>;

export type ApiListModelProps<T, RestApiT = undefined> = {
  fetchFunction: ApiListFetchFunction<T, RestApiT>;

  limitPerRequest?: number;
};
