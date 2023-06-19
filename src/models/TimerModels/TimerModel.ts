import { BaseTimerModel } from './BaseTimerModel';

export default class TimerModel extends BaseTimerModel {
  /**
   * Хранит исходный период времени работы таймера
   */
  protected _time!: number;

  constructor(time: number, onTimerUp: VoidFunction | null = null) {
    super(onTimerUp);

    this._setTime(time);
  }

  protected override _initTimeLeft(): number {
    return this._time;
  }

  protected _setTime(time: number): void {
    this._time = time < 0 ? 0 : time;
  }

  override restart(time = this._time): void {
    this.stop();
    this._setTime(time);
    this.start();
  }
}
