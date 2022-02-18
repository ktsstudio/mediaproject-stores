![kts](./logo.png)

# @ktsstudio/mediaproject-stores

Пакет с базовыми MobX-сторами для медиапроектов.

## Использование

`npm install @ktsstudio/mediaproject-stores`

`yarn add @ktsstudio/mediaproject-stores`

## Сторы

### BaseRootStore

От [этого стора](./src/stores/BaseRootStore.ts) должен быть отнаследован RootStore вашего приложения. В конструкторе нужно передать в параметрах объект эндпоинтов API (тип `EndpointsType` с обязательным эндпоинтом для авторизации в поле `auth`). Это необходимо для того, чтоб все подсторы могли иметь доступ к одному и тому же объекту доступных эндпоинтов API через поле _endpoints в RootStore. Пример использования приведен ниже.

```typescript
import { BaseRootStore, EndpointsType } from '@ktsstudio/mediaproject-stores';

const ENDPOINTS: EndpointsType = {
  auth: {
    url: 'https//backend/api/auth',
    method: 'GET',  // можно не указывать, если метод GET
  },
};

class RootStore extends BaseRootStore {
  constructor() {
    super(ENDPOINTS);
  }
}

const rootStore = new RootStore(ENDPOINTS);

console.log(rootStore._endpoints); // { auth: { url: 'https//backend/api/auth', method: 'GET' } }
```

### BaseSubstore

Бызовый [стор](./src/stores/BaseSubstore.ts). Должен находиться внутри RootStore. Принимает в конструкторе ссылку на RootStore, хранит ее в поле `rootStore` для обращения к полям главного стора (например, для чтения из него эндпоинтов API через `this.rootStore._endpoints`). Содержит `observable` поля `loading` (поле для отслеживания начала и окончания загрузки) and `error` (поле для индикации возникновения ошибки), а так же сеттеры для них (`setLoading` и `setError`). Пример использования приведен ниже.

```typescript
import { BaseSubstore } from '@ktsstudio/mediaproject-stores';
import { action, makeObservable, observable } from 'mobx';

import RootStore from './RootStore';

export default class MySubstore extends BaseSubstore<RootStore> {
  data: DataType | null = null;

  constructor(rootStore: RootStore) {
    super(rootStore);

    makeObservable(this, {
        data: observable,

        getData: action,
        setData: action,
    });
  }

  setData = (value: DataType | null): void => {
    this.data = value;
  };

  getData = async (): Promise<void> => {
    if (this.loading) {
      return;
    }

    this.setLoading(true);

    try {
      const response = await fetch(this.rootStore._endpoints.data.url);
      this.setData(await response.json());
    } catch {
      this.setError(true);
    } finally {
      this.setLoading(false);
    }
  };
}
```

### BaseUserStore

[Стор](./src/stores/BaseUserStore.ts) для работы с данными юзера. Должен находиться внутри RootStore. Принимает в конструкторе ссылку на него.
`UserStore` в вашем приложении должен быть отнаследован от этого стора. Пример использования приведен ниже.

```typescript
// store/RootStore.ts

// <...>
import { BaseUserStore } from '@ktsstudio/mediaproject-stores';

export default class RootStore extends BaseRootStore {
  // <...>
  userStore = new BaseUserStore(this);
}
```

```typescript
// store/hooks.ts

import { BaseUserStore } from '@ktsstudio/mediaproject-stores';
import { MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';

export function useUserStore(): BaseUserStore {
  return useContext(MobXProviderContext).rootStore.userStore;
}
```

Обращение в компоненте:

```typescript
// MyComponents.ts

import * as React from 'react';
import { observer } from 'mobx';

import { useUserStore } from 'store/hooks';

const MyComponent = () => {
  const { auth } = useUserStore();

  React.useEffect(() => {
    auth();
  }, []);

  return <div>hello world</div>
};

export default observer(MyComponent);
```


#### `observable` поля в `BaseUserStore`:

| **Observable**  | **Type**               | **Default** | **Setter**         | **Description**                                                  |
|-----------------|------------------------|-------------|--------------------|------------------------------------------------------------------|
| user            | ApiBaseUserType \ null | null        | setUser            | объект с данными пользователя                                    |
| messagesAllowed | boolean                | false       | setMessagesAllowed | давал ли пользователь разрешение на отправку сообщений от группы |
| gettingUser     | boolean                | false       | setGettingUser     | активен ли запрос получения данных юзера                         |
| sendingFlag     | boolean                | false       | setSendingFlag     | активен ли запрос установки флага                                |


#### `computed` поля в `BaseUserStore`:

| **Computed**    | **Type**               | **Description**                |
|-----------------|------------------------|--------------------------------|
| flags           | ApiFlagsType           | объект с флагами из user.flags |


#### `action` методы в `BaseUserStore`: 

| **Action** | **Params**                   | **Returns**                                                       | **Description**                                                             |
|------------|------------------------------|-------------------------------------------------------------------|-----------------------------------------------------------------------------|
| auth       | -                            | Promise<{ response: ApiBaseAuthType \ null }>                     | метод авторизации, шлет запрос auth из rootStore._endpoints                 |
| flag       | name: string, value: boolean | Promise<boolean>                                                  | метод установки флага, , шлет запрос flag из rootStore._endpoints           |
| get        | -                            | Promise<{ response: ApiBaseGetUserType<ApiBaseUserType> \ null }> | метод получения данных пользователя, шлет запрос auth из rootStore._getUser |

а так же сеттеры для всех `observable` полей
