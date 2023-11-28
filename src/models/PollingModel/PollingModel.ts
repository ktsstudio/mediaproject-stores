export default class PollingModel {
  private readonly _intervalTime: number; // мс

  private readonly _pollingFunc: VoidFunction;

  private readonly _isImmediate: boolean;

  private _pollingInterval: NodeJS.Timeout | null = null;

  constructor(
    intervalTime: number,
    pollingFunc: VoidFunction,
    isImmediate?: boolean
  ) {
    this._intervalTime = intervalTime;
    this._pollingFunc = pollingFunc;
    this._isImmediate = isImmediate ?? false;
  }

  startPolling = (): void => {
    this.stopPolling();

    if (this._isImmediate) {
      this._pollingFunc();
    }

    this._pollingInterval = setInterval(this._pollingFunc, this._intervalTime);
  };

  stopPolling = (): void => {
    if (this._pollingInterval) {
      clearInterval(this._pollingInterval);
      this._pollingInterval = null;
    }
  };
}
