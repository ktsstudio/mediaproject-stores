import * as Sentry from '@sentry/react';

import { logError } from '../../utils';

import {
  SentryConfigType,
  SentryTagEnum,
  SentryUserType,
  ApiErrorDataType,
  ExceptionType,
  RenderExceptionType,
  ApiExceptionType,
  VKBridgeExceptionType,
} from './types';

class SentryStore {
  private _inited = false;

  get shouldSendError(): boolean {
    return Boolean(
      window.is_production && Sentry.getCurrentHub().getClient() && this._inited
    );
  }

  private _setInited = (value: boolean): void => {
    this._inited = value;
  };

  private _captureException = (
    ...args: Parameters<typeof Sentry.captureException>
  ): void => {
    if (this.shouldSendError) {
      Sentry.captureException(...args);
    }
  };

  init = ({
    dsn = process.env.SENTRY_DSN,
    normalizeDepth = 6,
    user,
  }: SentryConfigType): void => {
    if (!window.is_production) {
      return;
    }

    if (!dsn) {
      logError('DSN argument was not provided for Sentry');
      return;
    }

    Sentry.init({
      dsn,
      normalizeDepth,
    });

    if (user) {
      this.setUser(user);
    }

    this._setInited(true);
  };

  setUser = (config: SentryUserType): void => {
    Sentry.setUser(config);
  };

  captureException = <T = any>({
    error,
    extra,
    type = SentryTagEnum.custom,
  }: ExceptionType<T>): void => {
    this._captureException(error, {
      tags: {
        type,
      },
      extra,
    });
  };

  captureRenderException = <T = any>({
    error,
    extra,
  }: RenderExceptionType<T>): void => {
    this._captureException(error, {
      tags: {
        type: SentryTagEnum.render,
      },
      extra,
    });
  };

  captureApiException = <ED extends ApiErrorDataType, T = any>({
    error,
    errorData,
    endpoint,
    payload,
  }: ApiExceptionType<T, ED>): void => {
    this._captureException(error, {
      tags: {
        type: SentryTagEnum.api,
        url: endpoint.url,
        code: errorData.code,
      },
      extra: {
        payload,
        errorData,
      },
    });
  };

  captureVKBridgeException = ({
    errorEvent,
    url,
    payload,
  }: VKBridgeExceptionType): void => {
    this._captureException(errorEvent.type, {
      tags: {
        type: SentryTagEnum.vkBridge,
        vkUrl: url,
        vkCode: errorEvent.type,
      },
      extra: {
        payload,
        errorData: errorEvent.data,
      },
    });
  };
}

export default SentryStore;
