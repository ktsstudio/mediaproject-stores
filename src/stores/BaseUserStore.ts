import { makeObservable, observable, action } from 'mobx';
import { api, ApiResponse } from '@ktsstudio/mediaproject-utils';

import { addParamsToEndpointUrl, sendSentryError, logError } from '../utils';

import BaseRootStore from './BaseRootStore';
import BaseSubstore from './BaseSubstore';
import { ApiBaseUserType, ApiBaseAuthType, ApiFlagsType } from './types/api';

export default class BaseUserStore<
  RootStoreT extends BaseRootStore = BaseRootStore,
  UserT extends ApiBaseUserType = ApiBaseUserType,
  AuthT extends ApiBaseAuthType = ApiBaseAuthType<UserT>
> extends BaseSubstore<RootStoreT> {
  user: null | UserT = null;
  flags: ApiFlagsType = {};
  messagesAllowed = false;

  sendingFlag = false;
  gettingUser = false;

  constructor(rootStore: RootStoreT) {
    super(rootStore);

    makeObservable(this, {
      user: observable,
      flags: observable,
      messagesAllowed: observable,

      sendingFlag: observable,
      gettingUser: observable,

      setData: action,
      setUser: action,
      setFlag: action,
      setFlags: action,
      setMessagesAllowed: action,
      setSendingFlag: action,
      setGettingUser: action,

      auth: action,
      get: action,
      flag: action,
    });
  }

  setData = (value: AuthT): void => {
    this.setUser(value.user as UserT);

    if (value.user.flags) {
      this.setFlags(value.user.flags);
    }

    if (value.messages_allowed) {
      this.setMessagesAllowed(true);
    }
  };

  setUser = (value: null | UserT): void => {
    this.user = value;
  };

  setFlag = (name: string, value: boolean): void => {
    this.flags[name] = value;
  };

  setFlags = (value: ApiFlagsType): void => {
    this.flags = value;
  };

  setMessagesAllowed = (value: boolean): void => {
    this.messagesAllowed = value;
  };

  setSendingFlag = (value: boolean): void => {
    this.sendingFlag = value;
  };

  setGettingUser = (value: boolean): void => {
    this.gettingUser = value;
  };

  auth = async (): Promise<{ response: AuthT | null }> => {
    if (this.loading || !this.rootStore._endpoints.auth) {
      logError('Missing endpoint for auth method in BaseUserStore');
      return { response: null };
    }

    this.setLoading(true);

    const { response, error, errorData }: ApiResponse<AuthT> = await api(
      addParamsToEndpointUrl(this.rootStore._endpoints.auth, window.search)
    );

    if (!response) {
      sendSentryError(error, {
        url: this.rootStore._endpoints.auth,
        errorData,
      });

      this.rootStore.setFatalError(true);

      this.setLoading(false);
      return { response: null };
    }

    this.setData(response);

    this.setLoading(false);
    return { response };
  };

  get = async (): Promise<{ response: UserT | null }> => {
    if (!this.rootStore._endpoints.getUser) {
      logError('Missing endpoint for get user method in BaseUserStore');
      return { response: null };
    }
    
    if (this.gettingUser) {
      return { response: null };
    }

    this.setGettingUser(true);

    const { response, error, errorData }: ApiResponse<UserT> = await api(
      this.rootStore._endpoints.getUser
    );

    if (!response) {
      sendSentryError(error, {
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
    if (!this.rootStore._endpoints.flag) {
      logError('Missing endpoint for send user flag method in BaseUserStore');
      return false;
    }

    if (this.sendingFlag) {
      return false;
    }

    this.setSendingFlag(true);

    const { response, error, errorData } = await api(
      this.rootStore._endpoints.flag,
      { name, value }
    );

    if (!response || error) {
      sendSentryError(error, {
        url: this.rootStore._endpoints.flag,
        errorData,
        payload: {
          name,
          value,
        },
      });

      this.setSendingFlag(false);
      return false;
    }

    this.setFlag(name, value);

    this.setSendingFlag(false);
    return true;
  };
}
