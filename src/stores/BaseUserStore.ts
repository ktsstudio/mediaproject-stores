import { makeObservable, observable, action } from 'mobx';
import { api, ApiResponse } from '@ktsstudio/mediaproject-utils';

import BaseRootStore from './BaseRootStore';
import BaseSubstore from './BaseSubstore';
import { ApiBaseUserType, ApiBaseAuthType, ApiFlagsType } from './types/api';
import { addParamsToEndpointUrl } from '../utils';

export default class BaseUserStore<
  RootStoreT extends BaseRootStore = BaseRootStore,
  UserT extends ApiBaseUserType = ApiBaseUserType,
  AuthT extends ApiBaseAuthType = ApiBaseAuthType
> extends BaseSubstore<RootStoreT> {
  user: null | UserT = null;
  flags: Record<string, boolean> | null = null;

  sendingFlag = false;
  gettingUser = false;

  constructor(rootStore: RootStoreT) {
    super(rootStore);

    makeObservable(this, {
      user: observable,
      flags: observable,
      sendingFlag: observable,
      gettingUser: observable,

      setUser: action,
      setFlags: action,
      setSendingFlag: action,
      setGettingUser: action,

      auth: action,
      get: action,
      flag: action,
    });
  }

  setUser = (value: null | UserT) => {
    this.user = value;
  };

  setFlag = (name: string, value: boolean): void => {
    if (this.flags) {
      this.flags[name] = value;
    } else {
      this.flags = {
        name: value,
      };
    }
  };

  setFlags = (value: ApiFlagsType | null): void => {
    this.flags = value;
  };

  setSendingFlag = (value: boolean): void => {
    this.sendingFlag = value;
  };

  setGettingUser = (value: boolean): void => {
    this.gettingUser = value;
  };

  auth = async (): Promise<{ response: AuthT | null }> => {
    if (this.loading) {
      return { response: null };
    }

    this.setLoading(true);

    const { response, error, errorData }: ApiResponse<AuthT> = await api(
      addParamsToEndpointUrl(this.rootStore._endpoints.auth, window.search)
    );

    if (!response) {
      this.sendSentryError(error, {
        url: this.rootStore._endpoints.auth,
        errorData,
      });

      this.setLoading(false);
      return { response: null };
    }

    this.setUser(response.user as UserT); // почему-то ругается

    this.setLoading(false);
    return { response };
  };

  get = async (): Promise<{ response: UserT | null }> => {
    if (this.gettingUser || !this.rootStore._endpoints.getUser) {
      return { response: null };
    }

    this.setGettingUser(true);

    const { response, error, errorData }: ApiResponse<UserT> = await api(
      this.rootStore._endpoints.getUser
    );

    if (!response) {
      this.sendSentryError(error, {
        url: this.rootStore._endpoints.getUser,
        errorData,
      });

      this.setGettingUser(false);
      return { response: null };
    }

    this.setGettingUser(false);
    return { response };
  };

  flag = async (name: string, value: boolean): Promise<boolean> => {
    if (this.sendingFlag || !this.rootStore._endpoints.flag) {
      return false;
    }

    this.setSendingFlag(true);

    const { response, error, errorData } = await api(
      this.rootStore._endpoints.flag,
      { name, value }
    );

    if (!response || error) {
      this.sendSentryError(error, {
        url: this.rootStore._endpoints.flag,
        errorData,
        name,
        value,
      });

      this.setSendingFlag(false);
      return false;
    }

    this.setFlag(name, value);

    this.setSendingFlag(false);
    return true;
  };
}
