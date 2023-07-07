export interface ILocalStore {
  // Любой локальный store должен реализовывать метод destroy, в котором происходят отписки от реакций
  destroy: VoidFunction;
}
