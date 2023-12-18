import { appParamsStore } from '../stores';

const logError = (error: string): void => {
  if (appParamsStore.isDev) {
    // eslint-disable-next-line
    console.error(`[@ktsstudio/mediaproject-stores] ${error}`);
  }
};

export { logError };
