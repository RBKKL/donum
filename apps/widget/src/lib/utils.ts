export const waitSeconds = (interval: number) =>
  new Promise((resolve) => setTimeout(resolve, interval * 1000));
