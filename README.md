![kts](./logo.png)

# @ktsstudio/mediaproject-stores

Пакет с базовыми MobX-сторами для медиапроектов.

## Использование

`npm install @ktsstudio/mediaproject-stores`

`yarn add @ktsstudio/mediaproject-stores`

## Модели

### SubStoreModel

Модель базового стора. Такой стор должен находиться внутри RootStore. Принимает в конструкторе ссылку на RootStore, хранит ее в поле `rootStore` для обращения к полям главного стора (например, для чтения из него эндпоинтов API через `this.rootStore.endpoints`). Пример использования приведен ниже.

```typescript
import { SubStoreModel } from '@ktsstudio/mediaproject-stores';
import { action, makeObservable, observable } from 'mobx';

import RootStore from './RootStore';

export default class MySubStore extends SubStoreModel<RootStore> {
  data: DataType | null = null;

  constructor(rootStore: RootStore) {
    super(rootStore);

    makeObservable(this, {
      data: observable,
    });
  }
}
```

### MetaModel

Модель для контроля состояния загрузки.

### ApiListModel

Модель предназначена для работы со списками, которые загружаются с сервера.
Предоставляет методы для загрузки данных с сервера с оффсетом или пагинацией, контроля состояния загрузки, сброса данных.
При достижении конца списка, модель устанавливает флаг, что список загружен.

### MockApiListModel

Модель расширяет ApiListModel, добавляя возможность работы с мокапами.

### PollingModel

Модель, которая раз в заданное количество времени вызывает callback-функцию.

### BlurAndFocusHandlerModel

Модель для добавления обработчиков на блюр и фокус окна.

### BaseTimerModel

Абстрактный класс для модели таймера.

### TimerModel

Модель таймера, который работает заданное количество секунд и по окончании работы вызывает callback-функцию.

### FixedTimerModel

Модель таймера, который отсчитывает время до заданной даты в секундах и по окончании вызывает callback-функцию.

### FieldModel

Модель для изменяемых полей классов.

## Сторы

### RootStore

От этого стора должен быть отнаследован RootStore вашего приложения. В конструкторе нужно передать в параметрах объект эндпоинтов API (тип `EndpointsType` с обязательным эндпоинтом для авторизации в поле `auth`). Это необходимо для того, чтоб все подсторы могли иметь доступ к одному и тому же объекту доступных эндпоинтов API через поле \_endpoints в RootStore. Пример использования приведен ниже.

```typescript
import {
  RootStore as BaseRootStore,
  EndpointsType,
} from '@ktsstudio/mediaproject-stores';

const ENDPOINTS: EndpointsType = {
  auth: {
    url: 'https//backend/api/auth',
    method: 'GET', // можно не указывать, если метод GET
  },
};

class RootStore extends BaseRootStore {
  constructor() {
    super(ENDPOINTS);
  }
}

const rootStore = new RootStore(ENDPOINTS);

console.log(rootStore.endpoints); // { auth: { url: 'https//backend/api/auth', method: 'GET' } }
```

### UserStore

Стор для работы с данными юзера. Должен находиться внутри RootStore, так как наследуется от SubStoreModel.
Принимает в конструкторе ссылку на него. UserStore в вашем приложении должен быть отнаследован от этого стора. Пример использования приведен ниже.

```typescript
// store/RootStore.ts

// <...>
import {
  RootStore as BaseRootStore,
  UserStore,
} from '@ktsstudio/mediaproject-stores';

export default class RootStore extends BaseRootStore {
  // <...>
  userStore = new UserStore(this);
}
```

```typescript
// store/hooks.ts

import { UserStore } from '@ktsstudio/mediaproject-stores';
import { MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';

export function useUserStore(): UserStore {
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
  const { auth, user, authMeta } = useUserStore();

  React.useEffect(() => {
    auth();
  }, []);

  if (authMeta.isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Hello, {user.first_name}</div>;
};

export default observer(MyComponent);
```
