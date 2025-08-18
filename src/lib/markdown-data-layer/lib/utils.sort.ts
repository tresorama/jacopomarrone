export const sortByDateDescending = (a: Date | string, b: Date | string) => {
  return new Date(b).valueOf() - new Date(a).valueOf();
};