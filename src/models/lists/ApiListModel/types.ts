import { IMetaModel } from '../../MetaModel/types';

export type ApiListModelPrivateFields =
  | '_list'
  | '_listLoaded'
  | '_meta'
  | '_limitCountPerRequest'
  | '_fetchFunction'
  | '_setFetchResult'
  | '_appendList'
  | '_checkListLoaded';

export interface ApiListFetchProps<T = unknown> {
  listLoaded: boolean;
  limitCountPerRequest: number;
  lastItem: T | undefined;
  currentPage: number;
}

export interface IApiListModel<T, RestApiT> extends ApiListFetchProps<T> {
  list: T[];
  meta: IMetaModel;

  load(): Promise<RestApiT | undefined>;
  refresh(): Promise<RestApiT | undefined>;
  reset(): void;
}

export type ResponseApiListType<T> = {
  list: T[] | null;
};

export type ResponseRestApiType<RestApiT> = {
  restApiData: RestApiT;
};

export type ResponseApiType<T, RestApiT> = RestApiT extends undefined
  ? ResponseApiListType<T>
  : ResponseApiListType<T> & ResponseRestApiType<RestApiT>;

export type ApiListFetchFunction<T, RestApiT = undefined> = (
  fetchProps: ApiListFetchProps<T>
) => Promise<ResponseApiType<T, RestApiT>>;

export type ApiListModelProps<T, RestApiT = undefined> = {
  fetchFunction: ApiListFetchFunction<T, RestApiT>;

  limitPerRequest?: number;
};
