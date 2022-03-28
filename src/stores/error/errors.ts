export const ErrorsEnum = {
  notAuthorized: 'not_authorized',
  networkError: 'network_error',
  default: 'default',
};

export const errors = {
  [ErrorsEnum.notAuthorized]:
    'Произошла ошибка авторизации, попробуй перезайти в приложение',
  [ErrorsEnum.networkError]: 'Интернет-соединение прервано',
  [ErrorsEnum.default]: 'Произошла ошибка',
};
