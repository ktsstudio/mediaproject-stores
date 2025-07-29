# v4.2.0

- [*] Добавлена ссылка на публикацию в приватный реджестри
- [*] Обновлено ридми
- [+] Добавлена ValueModel
- [*] FieldModel переименована в FormFieldModel и наследует ValueModel с возможностью добавления валидаторов

# v4.1.0

- [*] Поднята версия @sentry/react до ^8.9.2

# v4.0.0

- [*] AppParamsStore: в конструктор добавлен аргумент `apiUrl`
- [*] Поднята версия @ktsstudio/mediaproject-utils до 6.0.0

# v3.0.0

- [+] ListModel
- [+] FieldModel
- [+] В конструктор PollingModel добавлен необязательный параметр isImmediate
- [+] стор с базовыми параметрами приложения – `AppParamsStore`
- [-] обращение к `window` за базовыми параметрами

## v2.2.0

- [+] модели для работы со списками: ApiListModel и MockApiListModel
- [+] PollingModel
- [+] BlurAndFocusHandlerModel
- [+] модели для таймеров: BaseTimerModel, TimerModel, FixedTimerModel

## v2.1.0

- [*] Sentry version
- [+] independent Sentry utils
- [*] SentryStore refactor

# v2.0.0

- [+] SentryStore
- [+] MetaModel
- [*] BaseRootStore -> RootStore
- [*] BaseSubstore -> SubStoreModel
- [*] BaseUserStore -> UserStore
- [*] all stores fields are private and can be accessed via getters and setters
- [*] flags are separate field in UserStore
- [*] BaseUserStore (UserStore now) uses MetaModel for loading and error checks
- [-] loading and error fields in BaseSubstore (now SubStoreModel)

### v1.1.1

- [*] lint
- [*] dependencies

## v1.1.0

- [*] refactor according to api schema
- [*] fix send user flag method payload

# v1.0.0

- [+] BaseRootStore, BaseSubstore, BaseUserStore, types
