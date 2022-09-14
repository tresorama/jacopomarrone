/**
 * Generic setTimeout implementation with Promise, used for wait some time then do something.
 * Generally used for simulating async operation execution time while developing.
 * @param time Time to wait for, in ms.
 * @param returnValue Optional. What will be returned from the promise.
 * @returns Promise that always resolve with "returnValue" after "time" ms.
 */
export const wait = <T,>(time: number, returnValue?: T) => new Promise<T | undefined>(resolve => setTimeout(() => resolve(returnValue), time));
