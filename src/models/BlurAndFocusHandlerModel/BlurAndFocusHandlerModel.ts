export default class BlurAndFocusHandlerModel {
  private readonly _blur: VoidFunction | null;
  private readonly _focus: VoidFunction | null;

  constructor(blur?: VoidFunction, focus?: VoidFunction) {
    this._blur = blur ?? null;
    this._focus = focus ?? null;
  }

  addListener() {
    /** Игра ставится на паузу, когда пользователь уходит с вкладки */
    this._blur && window.addEventListener('blur', this._blur);

    /** и снимается с паузы, когда он возвращается */
    this._focus && window.addEventListener('focus', this._focus);
  }

  destroy() {
    this._blur && window.removeEventListener('blur', this._blur);
    this._focus && window.removeEventListener('focus', this._focus);
  }
}
