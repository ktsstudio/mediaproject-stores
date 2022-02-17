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
TODO




