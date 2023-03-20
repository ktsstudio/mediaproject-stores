import { ApiListModelProps } from '../ApiListModel';

export type MockApiListModelPrivateFields =
  | '_listLengthLimit'
  | '_sleep'
  | '_sleepMs'
  | '_buildLimitedResponse';

export interface MockApiListModelProps<T, RestApiT = undefined>
  extends ApiListModelProps<T, RestApiT> {
  sleepMs?: number;
  listLengthLimit?: number;
}
