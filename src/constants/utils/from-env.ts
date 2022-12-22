export const getFromEnv = <T extends string>(name: T) => {
  console.log(`Checking existence of env var "${name}" ...`);
  const value = process.env[name];
  if (typeof value === 'undefined') {
    throw new Error(`"${name}" is missing in process.env !`);
  }
  return value;
};