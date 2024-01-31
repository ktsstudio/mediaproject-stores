import { User } from '@sentry/types';
import { BrowserOptions } from '@sentry/browser/dist/backend';

import {
  captureAPIException,
  captureException,
  captureFAPIException,
  captureRenderException,
  captureVKBridgeException,
  init,
  setUser,
} from './utils';
import {
  APIErrorDataType,
  RenderExceptionType,
  APIExceptionType,
  VKBridgeExceptionType,
  FAPIExceptionType,
  ExceptionType,
} from './types';

class SentryStore {
  init(
    options: BrowserOptions,
    isProd: boolean,
    isDev: boolean,
    user?: User
  ): void {
    init(options, isProd, isDev, user);
  }

  setUser(user: User): void {
    setUser(user);
  }

  captureException<E = any>(exception: ExceptionType<E>): void {
    captureException<E>(exception);
  }

  captureRenderException<E = any>(exception: RenderExceptionType<E>): void {
    captureRenderException<E>(exception);
  }

  captureAPIException<ED extends APIErrorDataType = APIErrorDataType, E = any>(
    exception: APIExceptionType<ED, E>
  ): void {
    captureAPIException<ED, E>(exception);
  }

  captureVKBridgeException<E = any>(exception: VKBridgeExceptionType<E>): void {
    captureVKBridgeException<E>(exception);
  }

  captureFAPIException<E = any>(exception: FAPIExceptionType<E>): void {
    captureFAPIException<E>(exception);
  }
}

export default SentryStore;
