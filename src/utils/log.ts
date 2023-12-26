const logError = (error: string, isDev: boolean): void => {
  if (isDev) {
    // eslint-disable-next-line
    console.error(`[@ktsstudio/mediaproject-stores] ${error}`);
  }
};

export { logError };
