const isDOM = () => Boolean(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.documentElement
);
const isTest = () => {
  if (process.env.JEST_WORKER_ID !== undefined) return true;
  if (process.env.NODE_ENV === 'test') return true;
  return false;
};

export const isBrowser = () => {
  if (isTest()) return false;
  return isDOM();
};
export const isServer = () => !isDOM();