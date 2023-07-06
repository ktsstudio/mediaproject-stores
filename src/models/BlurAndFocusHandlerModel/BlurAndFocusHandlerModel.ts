import { ILocalStore } from '../../types/ILocalStore';

export default class BlurAndFocusHandlerModel implements ILocalStore {
  private readonly _blur: VoidFunction | null;
  private readonly _focus: VoidFunction | null;

  constructor(blur?: VoidFunction, focus?: VoidFunction) {
    this._blur = blur ?? null;
    this._focus = focus ?? null;
  }

  addListeners() {
    this._blur && window.addEventListener('blur', this._blur);
    this._focus && window.addEventListener('focus', this._focus);
  }

  destroy() {
    this._blur && window.removeEventListener('blur', this._blur);
    this._focus && window.removeEventListener('focus', this._focus);
  }
}
