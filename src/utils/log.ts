const logError = (error: string, isDev: boolean): void => {
  if (isDev) {
    // eslint-disable-next-line
    console.error(`[@kts-specials/mediaproject-stores] ${error}`);
  }
};

export { logError };
