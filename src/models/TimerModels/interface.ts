interface ILocalStore {
  // Любой локальный store должен реализовывать метод destroy, в котором происходят отписки от реакций
  destroy: VoidFunction;
}

export interface Interface extends ILocalStore {
  get secondsLeft(): number;
  get isFinished(): boolean;
  get isRunning(): boolean;
  get isPaused(): boolean;
  start: VoidFunction;
  stop: VoidFunction;
  pause: VoidFunction;
  continue: VoidFunction;
  setOnTimerEnd: (handle: VoidFunction) => void;
}
