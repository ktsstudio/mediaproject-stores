import { action, computed, makeObservable, observable } from 'mobx';

import { ITimerModel } from './interfaces';
import { TIMER_TICK_INTERVAL_MSEC, TIMER_TICK_INTERVAL_SEC } from './config';

type TimerModelPrivateFields =
  | '_timeIntervalID'
  | '_secondsLeft'
  | '_onTick'
  | '_setTimeIntervalID'
  | '_clearTimeIntervalID';

export abstract class BaseTimerModel implements ITimerModel {
  protected _timeIntervalID: NodeJS.Timeout | null = null;

  /**
   * Осталось секунд до конца таймера
   */
  protected _secondsLeft = Number.MAX_SAFE_INTEGER;

  protected _onTimerUp: VoidFunction | null = null;

  protected constructor(onTimerUp: VoidFunction | null = null) {
    this._onTimerUp = onTimerUp;

    makeObservable<this, TimerModelPrivateFields>(this, {
      _timeIntervalID: observable,
      _secondsLeft: observable,

      secondsLeft: computed,
      isFinished: computed,
      isRunning: computed,
      isPaused: computed,

      _onTick: action.bound,
      _setTimeIntervalID: action.bound,
      _clearTimeIntervalID: action.bound,
      start: action.bound,
      stop: action.bound,
      pause: action.bound,
      continue: action.bound,
    });
  }

  /**
   * Осталось секунд до конца таймера
   */
  get secondsLeft(): number {
    return this._secondsLeft;
  }

  get isFinished(): boolean {
    return this._secondsLeft <= 0;
  }

  get isRunning(): boolean {
    return this._timeIntervalID !== null;
  }

  get isPaused(): boolean {
    return !this.isRunning && !this.isFinished;
  }

  protected abstract _initTimeLeft(): number;

  setOnTimerEnd = (handle: VoidFunction): void => {
    this._onTimerUp = handle;
  };

  protected _onTick = (): void => {
    this._secondsLeft -= TIMER_TICK_INTERVAL_SEC;

    if (this._secondsLeft <= 0) {
      this.stop();
      this._onTimerUp?.();
    }
  };

  start(): void {
    this._clearTimeIntervalID();

    this._secondsLeft = this._initTimeLeft();

    if (this._secondsLeft >= TIMER_TICK_INTERVAL_SEC) {
      this._setTimeIntervalID();
    }
  }

  stop(): void {
    this._clearTimeIntervalID();
    this._secondsLeft = 0;
  }

  pause(): void {
    this.isRunning && this._clearTimeIntervalID();
  }

  continue(): void {
    this.isPaused && this._setTimeIntervalID();
  }

  restart(): void {
    this.stop();
    this.start();
  }

  protected _setTimeIntervalID() {
    if (!this._timeIntervalID) {
      this._timeIntervalID = setInterval(
        this._onTick,
        TIMER_TICK_INTERVAL_MSEC
      );
    }
  }

  protected _clearTimeIntervalID() {
    if (this._timeIntervalID) {
      clearInterval(this._timeIntervalID);
      this._timeIntervalID = null;
    }
  }

  destroy() {
    this.stop();
  }
}
