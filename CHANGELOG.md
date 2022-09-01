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
