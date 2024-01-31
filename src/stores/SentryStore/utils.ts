import * as Sentry from '@sentry/react';
import { User } from '@sentry/types';
import { BrowserOptions } from '@sentry/browser/dist/backend';

import {
  APIErrorDataType,
  APIExceptionType,
  CustomExceptionType,
  ExceptionType,
  FAPIExceptionType,
  RenderExceptionType,
  VKBridgeExceptionType,
} from './types';

// Метод инициализации Sentry
const init = (
  {
    dsn = process.env.SENTRY_DSN,
    normalizeDepth = 6,
    environment = undefined,
    ...contextOptions
  }: BrowserOptions,
  isProd: boolean,
  isDev: boolean,
  user?: User
) => {
  Sentry.init({
    dsn,
    // Глубина вложенных свойств в объектах,
    // передаваемых в extra при отправке событий
    normalizeDepth,
    // Дев или прод окружение
    environment: environment || (isProd ? (isDev ? 'dev' : 'prod') : undefined),
    // Для локальной разработки Sentry отключен
    enabled: isProd,
    ...contextOptions,
  });

  if (user) {
    setUser(user);
  }
};

// Метод установки текущего пользователя
const setUser = (user: User): void => {
  Sentry.setUser(user);
};

// Базовый метод для отправки ошибок
const captureException = <E = any>({
  error,
  context,
}: ExceptionType<E>): void => {
  Sentry.captureException(error, context);
};

const captureCustomException = <E = any>({
  error,
  type,
  context,
}: CustomExceptionType<E>): void => {
  captureException({
    error,
    context: {
      ...(context || {}),
      tags: {
        type,
        ...(context?.tags || {}),
      },
    },
  });
};

// Метод для отправки ошибок рендера
const captureRenderException = <E = any>({
  error,
  errorInfo,
  context = {},
}: RenderExceptionType<E>): void => {
  captureCustomException<E>({
    error,
    type: 'render',
    context: {
      ...context,
      extra: {
        errorInfo,
        ...(context?.extra || {}),
      },
    },
  });
};

// Метод отправки ошибок из API
const captureAPIException = <
  ED extends APIErrorDataType = APIErrorDataType,
  E = any
>({
  error,
  url,
  errorData,
  payload,
  context = {},
}: APIExceptionType<ED, E>): void => {
  captureCustomException<E>({
    error,
    type: 'api',
    context: {
      ...context,
      tags: {
        // Запрос, на который вернулась ошибка
        url,
        // Числовой код ошибки, который вернулся в ошибке
        status: errorData.status,
        // Текстовый код ошибки, который вернулся в ошибке
        code: errorData.code,
        ...(context?.tags || {}),
      },
      extra: {
        // Что было отправлено в запросе
        payload,
        errorData,
        ...(context?.extra || {}),
      },
    },
  });
};

const captureVKBridgeException = <E>({
  error,
  url,
  payload,
  context = {},
}: VKBridgeExceptionType<E>): void => {
  captureCustomException<E>({
    error,
    type: 'vk_bridge',
    context: {
      ...context,
      tags: {
        // Запрос, на который вернулась ошибка
        url,
        // Текстовый код ошибки, который вернулся в ошибке
        code: error.type,
        ...(context?.tags || {}),
      },
      extra: {
        // Что было отправлено в запросе
        payload,
        errorData: error.data,
        ...(context?.extra || {}),
      },
    },
  });
};

const captureFAPIException = <E = any>({
  status,
  data,
  error,
  url,
  fields,
  context = {},
}: FAPIExceptionType<E>): void => {
  captureCustomException<E>({
    error,
    type: 'fapi',
    context: {
      ...context,
      tags: {
        // Запрос, на который вернулась ошибка
        url,
        ...(context?.tags || {}),
      },
      extra: {
        // Числовой код ошибки, который вернулся в ошибке
        status,
        data,
        // Что было отправлено в запросе
        fields,
        ...(context?.extra || {}),
      },
    },
  });
};

export {
  init,
  setUser,
  captureException,
  captureRenderException,
  captureAPIException,
  captureVKBridgeException,
  captureFAPIException,
};
