export default class PollingModel {
  private readonly _intervalTime: number; // мс

  private readonly _pollingFunc: VoidFunction;

  private _pollingInterval: NodeJS.Timeout | null = null;

  constructor(intervalTime: number, pollingFunc: VoidFunction) {
    this._intervalTime = intervalTime;
    this._pollingFunc = pollingFunc;
  }

  startPolling = (): void => {
    this.stopPolling();

    this._pollingInterval = setInterval(this._pollingFunc, this._intervalTime);
  };

  stopPolling = (): void => {
    if (this._pollingInterval) {
      clearInterval(this._pollingInterval);
      this._pollingInterval = null;
    }
  };
}
