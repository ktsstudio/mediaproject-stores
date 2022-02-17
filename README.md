![kts](./logo.png)

# @ktsstudio/mediaproject-stores

Package with basic MobX stores for media projects.

## Usage

`npm install @ktsstudio/mediaproject-stores`

`yarn add @ktsstudio/mediaproject-stores`

## Stores

### BaseRootStore

[This store](./src/stores/BaseRootStore.ts) should be extended when you create your RootStore. To its constructor should be passed object of type `EndpointsType` with required `auth` field, so in the future you can use `BaseUserStore` methods. Example of usage is below.

```typescript
import { BaseRootStore, EndpointsType } from '@ktsstudio/mediaproject-stores';

const endpoints: EndpointsType = {
  auth: {
    url: 'https//my.backend/api/auth',
    method: 'GET',
  },
};

export default class RootStore extends BaseRootStore {
  constructor() {
    super(endpoints);
  }
}
```

### BaseSubstore

If you extend [this store](./src/stores/BaseSubstore.ts) when creating your substore you'll be able to use predefined properties `loading` and `error` (also their setters) and have acces to `RootStore` if you pass it to parent's constructor. Example of usage is below.

```typescript
import { BaseSubstore } from '@ktsstudio/mediaproject-stores';
import { makeAutoObservable } from 'mobx';

import RootStore, { endpoints } from './RootStore';

export default class MySubstore extends BaseSubstore<RootStore> {
  data: DataType | null = null;

  constructor(rootStore: RootStore) {
    super(rootStore);

    makeAutoObservable(this, {
      rootStore: false,
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
      const response = await fetch(endpoints.data.url);
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

You can extend your `UserStore` with [this store](./src/stores/BaseUserStore.ts) or use it as it is. Example of usage is below.

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

And then in component:

```typescript
// MyComponents.ts

import * as React from 'react';
import { useUserStore } from 'store/hooks';
import { observer } from 'mobx';

const MyComponent = () => {
  const { auth } = useUserStore();

  React.useEffect(() => {
    auth();
  }, []);

  return <div>hello world</div>
};

export default MyComponent;
```

And that's it!

List of `BaseUserStore` observables:

| **Observable**  | **Type**                | **Default** | **Description**                                           |
|-----------------|-------------------------|-------------|-----------------------------------------------------------|
| user            | ApiBaseUserType \| null | null        | object with user info                                     |
| flags           | ApiFlagsType            | {}          | user flags (also can find them in user)                   |
| messagesAllowed | boolean                 | false       | did user gave permission to send him messages from group  |

List of `BaseUserStore` actions: 

| **Action** | **Params**                    | **Returns**                                    | **Description**             |
|------------|-------------------------------|------------------------------------------------|-----------------------------|
| auth       | none                          | Promise<{ response: ApiBaseAuthType \| null }> | action to process user auth |
| flag       | name: string,  value: boolean | Promise<boolean>                               | action to send user flag    |
| get        | none                          | Promise<{ response: ApiBaseUserType \| null }> | action to update user info  |


