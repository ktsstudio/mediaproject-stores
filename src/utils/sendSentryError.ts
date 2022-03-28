import * as Sentry from '@sentry/react';

import { SentryDataType } from '../stores/error/types';

export const shouldSendSentryError = (): boolean =>
  Boolean(!window.is_dev && Sentry.getCurrentHub().getClient());

export default function sendSentryError({
  error,
  errorData,
  url,
  params,
  extra = {},
  isDev = false,
}: SentryDataType): void {
  if (shouldSendSentryError() || isDev) {
    try {
      const index = url.indexOf('?');
      const method = index === -1 ? url : url.slice(0, index);
      Sentry.configureScope((scope) =>
        scope.setTransactionName(`API ${method}`)
      );
      Sentry.captureEvent({
        message: error,
        tags: {
          status: errorData?.message,
          method,
        },
        extra: {
          data: params,
          errorData,
          error,
          extra,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}
