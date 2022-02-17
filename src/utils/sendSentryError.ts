import * as Sentry from '@sentry/react';

const shouldSendSentryError = (): boolean =>
  Boolean(!window.is_dev && Sentry.getCurrentHub().getClient());

export default function sendSentryError(
  // eslint-disable-next-line
  exception: any,
  params: Record<string, unknown>
): void {
  if (shouldSendSentryError()) {
    try {
      Sentry.captureException(exception, params);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}
