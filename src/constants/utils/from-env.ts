export const getFromEnv = <T extends (keyof NodeJS.ProcessEnv)>(name: T) => {
  console.log(`Checking existence of env var "${name}" ...`);
  const value = process.env[name];
  if (typeof value === 'undefined') {
    throw new Error(`Missing env var => "${name}" in process.env !`);
  }
  return value;
};