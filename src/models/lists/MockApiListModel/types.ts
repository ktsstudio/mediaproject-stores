import { ApiListModelProps } from '../ApiListModel';

export type MockApiListModelPrivateFields =
  | '_listLengthLimit'
  | '_sleep'
  | '_sleepTimeoutMs';

export interface MockApiListModelProps<T, RestApiT = undefined>
  extends ApiListModelProps<T, RestApiT> {
  sleepTimeoutMs?: number;
  listLengthLimit?: number;
}
