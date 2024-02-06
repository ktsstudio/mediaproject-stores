import { makeObservable, observable, action, computed } from 'mobx';
import { api, ApiResponse } from '@ktsstudio/mediaproject-utils';

import { RootStore } from '../RootStore';
import { MetaModel, SubStoreModel } from '../../models';
import { addParamsToEndpointUrl, logError } from '../../utils';

import {
  ApiAuthType,
  ApiGetUserType,
  ApiUserType,
  FlagsType,
  FlagParamsType,
  UserStorePrivateFields,
} from './types';

class UserStore<
  RootStoreT extends RootStore = RootStore,
  UserT extends ApiUserType = ApiUserType,
  AuthT extends ApiAuthType = ApiAuthType<UserT>
> extends SubStoreModel<RootStoreT> {
  private readonly _isDev: boolean;

  private _user: null | UserT = null;
  private _flags: FlagsType = {};
  private _messagesAllowed = false;

  authMeta = new MetaModel();
  getMeta = new MetaModel();
  flagMeta = new MetaModel();

  constructor(rootStore: RootStoreT, isDev: boolean) {
    super(rootStore);

    this._isDev = isDev;

    makeObservable<UserStore, UserStorePrivateFields>(this, {
      _user: observable,
      _flags: observable,
      _messagesAllowed: observable,

      user: computed,
      flags: computed,
      messagesAllowed: computed,

      setAuthData: action.bound,
      setUser: action.bound,
      setFlag: action.bound,
      setMessagesAllowed: action.bound,

      auth: action.bound,
      get: action.bound,
      flag: action.bound,
    });
  }

  get user(): UserT | null {
    return this._user;
  }

  get flags(): FlagsType {
    return this._flags || {};
  }

  get messagesAllowed(): boolean {
    return this._messagesAllowed;
  }

  setUser(value: UserT | null): void {
    this._user = value;
  }

  setFlag(name: string, value: boolean): void {
    this._flags[name] = value;
  }

  setMessagesAllowed = (value: boolean): void => {
    this._messagesAllowed = value;
  };

  setAuthData(value: AuthT): void {
    this.setUser(value.user as UserT);

    if (value.user.flags) {
      Object.entries(value.user.flags).forEach(([name, value]) => {
        this.setFlag(name, value);
      });
    }

    if (value.messages_allowed) {
      this.setMessagesAllowed(true);
    }
  }

  async auth(
    authParams: string | Record<string, string>
  ): Promise<ApiResponse<AuthT | null>> {
    if (!this.rootStore.endpoints.auth) {
      logError(
        'Missing endpoint for auth method in BaseUserStore',
        this._isDev
      );
      return { response: null };
    }

    if (this.authMeta.isLoading) {
      return { response: null };
    }

    this.authMeta.setLoadedStartMeta();

    const { response, error, errorData }: ApiResponse<AuthT> = await api(
      addParamsToEndpointUrl(this.rootStore.endpoints.auth, authParams)
    );

    if (!response || error) {
      this.authMeta.setLoadedErrorMeta();

      return { response, error, errorData };
    }

    this.setAuthData(response);
    this.authMeta.setLoadedSuccessMeta();

    return { response, error, errorData };
  }

  async get(): Promise<ApiResponse<ApiGetUserType<UserT> | null>> {
    if (!this.rootStore.endpoints.getUser) {
      logError(
        'Missing endpoint for get user method in BaseUserStore',
        this._isDev
      );
      return { response: null };
    }

    if (this.getMeta.isLoading) {
      return { response: null };
    }

    this.getMeta.setLoadedStartMeta();

    const { response, error, errorData }: ApiResponse<ApiGetUserType<UserT>> =
      await api(this.rootStore.endpoints.getUser);

    if (!response || error) {
      this.getMeta.setLoadedErrorMeta();

      return { response, error, errorData };
    }

    this.setUser(response.user);
    this.getMeta.setLoadedErrorMeta();

    return { response, error, errorData };
  }

  async flag({
    name,
    value,
    withLoadingCheck = true,
  }: FlagParamsType): Promise<ApiResponse<boolean | null>> {
    if (!this.rootStore.endpoints.flag) {
      logError(
        'Missing endpoint for send user flag method in BaseUserStore',
        this._isDev
      );
      return { response: null };
    }

    if (withLoadingCheck && this.flagMeta.isLoading) {
      return { response: null };
    }

    if (withLoadingCheck) {
      this.flagMeta.setLoadedStartMeta();
    }

    const { response, error, errorData } = await api(
      this.rootStore.endpoints.flag,
      { name, value }
    );

    if (!response || error) {
      if (withLoadingCheck) {
        this.flagMeta.setLoadedErrorMeta();
      }

      return { response, error, errorData };
    }

    this.setFlag(name, value);

    if (withLoadingCheck) {
      this.flagMeta.setLoadedSuccessMeta();
    }

    return { response, error, errorData };
  }
}

export default UserStore;
