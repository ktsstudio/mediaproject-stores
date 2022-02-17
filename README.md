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

Example of usage.

```typescript
// TODO: example
```

If you extend `BaseSubstore` when creating your substore you'll be able to use its observables and actions listed below.
TODO: finish




