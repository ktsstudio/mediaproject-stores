import dayjs, { Dayjs } from 'dayjs';

import { BaseTimerModel } from './BaseTimerModel';

export type FixedTimerParams = {
  date: Dayjs;
  onTimerUp?: VoidFunction | null;
  immediateStart?: boolean;
};

export default class FixedTimerModel extends BaseTimerModel {
  /**
   * Хранит дату до которой таймер будет вести отсчет времени
   */
  private _fixedDate: Dayjs;

  constructor({
    date,
    onTimerUp = null,
    immediateStart = true,
  }: FixedTimerParams) {
    super(onTimerUp);

    this._fixedDate = date;
    this._timeLeft = this._initTimeLeft();

    if (immediateStart) {
      this.start();
    }
  }

  /**
   * Получает разницу между датой таймера и текущей датой в секундах
   */
  protected override _initTimeLeft(): number {
    return Math.max(0, this._fixedDate.diff(dayjs(), 'seconds'));
  }

  override continue(): void {
    this.isPaused && this.start();
  }

  /**
   * Рестарт для обновления остатка времени
   */
  override restart(date = this._fixedDate): void {
    this.stop();
    this._fixedDate = date;
    this.start();
  }
}
