import { RootStore } from '../../stores/RootStore';

class SubStoreModel<RootStoreT = RootStore> {
  readonly rootStore: RootStoreT;

  constructor(rootStore: RootStoreT) {
    this.rootStore = rootStore;
  }
}

export default SubStoreModel;
