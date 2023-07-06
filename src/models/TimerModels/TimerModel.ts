import { BaseTimerModel } from './BaseTimerModel';

export class TimerModel extends BaseTimerModel {
  /**
   * Хранит исходный период времени работы таймера
   */
  protected _time!: number;

  constructor(time: number, onTimerUp: VoidFunction | null = null) {
    super(onTimerUp);

    this._setTime(time);
    this._secondsLeft = this._initTimeLeft();
  }

  protected override _initTimeLeft(): number {
    return this._time;
  }

  protected _setTime(time: number): void {
    this._time = time < 0 ? 0 : Math.ceil(time);
  }

  override restart(time = this._time): void {
    this.stop();
    this._setTime(time);
    this.start();
  }
}
