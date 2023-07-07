import { ILocalStore } from '../../types/ILocalStore';

export interface ITimerModel extends ILocalStore {
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
