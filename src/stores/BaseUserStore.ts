import { makeObservable, observable, action } from 'mobx';
import { api, ApiResponse } from '@ktsstudio/mediaproject-utils';

import BaseRootStore from './BaseRootStore';
import BaseSubstore from './BaseSubstore';
import { ApiBaseUserType, ApiBaseAuthType } from './types/api';

export default class BaseUserStore<
  RootStoreT extends BaseRootStore = BaseRootStore,
  UserT extends ApiBaseUserType = ApiBaseUserType,
  AuthT extends ApiBaseAuthType = ApiBaseAuthType
> extends BaseSubstore<RootStoreT> {
  user: null | UserT = null;

  sendingFlag = false;
  gettingUser = false;

  constructor(rootStore: RootStoreT) {
    super(rootStore);

    makeObservable(this, {
      user: observable,
      sendingFlag: observable,
      gettingUser: observable,

      setUser: action,
      setSendingFlag: action,
      setGettingUser: action,

      auth: action,
      get: action,
      flag: action,
    })
  }

  setUser = (value: null | UserT) => {
    this.user = value;
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

    const [url, method] = this.rootStore._urls.auth;
    
    const { response, error, errorData }: ApiResponse<AuthT> = await api(`${url}${window.search}`, method);

    if (!response) {
      this.sendSentryError(error, { errorData, url })
      this.setLoading(false);
      return { response: null };
    }

    this.setUser(response.user as UserT); // почему-то ругается

    this.setLoading(false);
    return { response };
  };

  get = async (): Promise<{ response: UserT | null }> => {
    if (this.gettingUser || !this.rootStore._urls.getUser) {
      return { response: null }
    }

    this.setGettingUser(true);

    const { response, error, errorData }: ApiResponse<UserT> = await api(...this.rootStore._urls.getUser);

    if (!response) {
      this.sendSentryError(error, {
        url: this.rootStore._urls.getUser,
        errorData,
      });

      this.setGettingUser(false);
      return { response: null };
    }

    this.setGettingUser(false);
    return { response };
  };

  flag = async (name: string, value: boolean | number): Promise<boolean> => {
    if (this.sendingFlag || !this.rootStore._urls.flag) {
      return false;
    } 

    this.setSendingFlag(true);

    const { response, error, errorData } = await api(...this.rootStore._urls.flag, { name, value });

    if (!response) {
      this.sendSentryError(error, {
        url: this.rootStore._urls.flag,
        errorData,
        name,
        value,
      });

      this.setSendingFlag(false);
      return false;
    }

    return true;
  };
}