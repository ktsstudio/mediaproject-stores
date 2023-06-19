import { action, computed, makeObservable, observable } from 'mobx';

import { Interface } from './interface';
import { TIMER_TICK_INTERVAL_MSEC, TIMER_TICK_INTERVAL_SEC } from './config';

type TimerModelPrivateFields =
  | '_timeLeft'
  | '_onTick'
  | '_setTimeIntervalID'
  | '_clearTimeIntervalID';

export abstract class BaseTimerModel implements Interface {
  protected _timeIntervalID: NodeJS.Timeout | null = null;

  /**
   * Осталось секунд до конца таймера
   */
  protected _timeLeft = Number.MAX_SAFE_INTEGER;

  protected _onTimerUp: VoidFunction | null = null;

  protected constructor(onTimerUp: VoidFunction | null = null) {
    this._onTimerUp = onTimerUp;

    makeObservable<this, TimerModelPrivateFields>(this, {
      _timeLeft: observable,

      timeLeft: computed,
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
  get timeLeft(): number {
    return this._timeLeft;
  }

  get isFinished(): boolean {
    return this._timeLeft <= 0;
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
    if (this._timeLeft > 0) {
      this._timeLeft -= TIMER_TICK_INTERVAL_SEC;
    } else {
      this.stop();
      this._onTimerUp?.();
    }
  };

  start(): void {
    this._clearTimeIntervalID();

    this._timeLeft = this._initTimeLeft();

    if (this._timeLeft > TIMER_TICK_INTERVAL_SEC) {
      this._setTimeIntervalID();
    }
  }

  stop(): void {
    this._clearTimeIntervalID();
    this._timeLeft = 0;
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
