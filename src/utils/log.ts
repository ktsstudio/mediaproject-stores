const logError = (error: string): void => {
  if (window.is_dev) {
    // eslint-disable-next-line
    console.error(`[@ktsstudio/mediaproject-stores] ${error}`);
  }
};

export { logError };
