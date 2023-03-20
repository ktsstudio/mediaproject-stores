export interface IMetaModel {
  get isLoading(): boolean;
  get isError(): boolean;
  get isInitialMetaState(): boolean;
  get isLoaded(): boolean;

  reset(): void;
  setLoadedStartMeta(): void;
  setLoadedSuccessMeta(): void;
  setLoadedErrorMeta(): void;
}
