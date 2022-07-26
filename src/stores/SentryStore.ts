import * as Sentry from '@sentry/react';

import logError from '../utils/logError';

import {
  SentryTagType,
  SentryInitConfigType,
  SentryUserConfigType,
  SentryVKUserConfigType,
} from './types/sentry';
import { EndpointType } from './types/stores';
import { ApiErrorDataType, VKBridgeErrorEventType } from './types/api';

export default class SentryStore {
  private _inited = false;

  get shouldSendError(): boolean {
    return Boolean(
      !window.is_dev && Sentry.getCurrentHub().getClient() && this._inited
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
    userConfig,
  }: SentryInitConfigType): void => {
    if (!dsn) {
      logError('DSN argument was not provided for Sentry');
      return;
    }

    if (!window.is_dev) {
      Sentry.init({
        dsn,
        normalizeDepth,
      });

      if (userConfig) {
        this.setUser(userConfig);
      }

      this._setInited(true);
    }
  };

  setUser = (config: SentryUserConfigType): void => {
    Sentry.setUser(config);
  };

  setVKUser = (config: SentryVKUserConfigType): void => {
    this.setUser(config);
  };

  captureException = <T = any>(
    error: T,
    extra?: Record<string, any>,
    type: SentryTagType = 'custom'
  ): void => {
    this._captureException(error, {
      tags: {
        type,
      },
      extra,
    });
  };

  captureRenderException = <T = any>(
    error: T,
    extra?: Record<string, any>
  ): void => {
    this._captureException(error, {
      tags: {
        type: 'render',
      },
      extra,
    });
  };

  captureApiException = <ED extends ApiErrorDataType, T = any>(
    error: T,
    errorData: ED,
    endpoint: EndpointType,
    payload?: Record<string, any>
  ): void => {
    this._captureException(error, {
      tags: {
        type: 'api',
        url: endpoint.url,
        code: errorData.code,
      },
      extra: {
        payload,
        errorData,
      },
    });
  };

  captureVKBridgeException = (errorEvent: VKBridgeErrorEventType): void => {
    this._captureException(errorEvent.type, {
      tags: {
        type: 'vk_bridge',
      },
      extra: {
        data: errorEvent.data,
      },
    });
  };
}
