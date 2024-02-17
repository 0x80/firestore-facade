import { green, red } from "yoctocolors";

export function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

export function last<T>(array: T[]) {
  assert(array.length > 0, "Called last() on empty array");

  return array[array.length - 1];
}

export type Logger = {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  success: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

export function createLogger(isVerbose = false): Logger {
  return isVerbose
    ? {
        debug: (...args: any[]) => console.log.apply(console, args),
        info: (...args: any[]) => console.log.apply(console, args),
        success: (...args: any[]) =>
          console.log.apply(console, args.map(green)),
        error: (...args: any[]) => console.error.apply(console, args.map(red)),
      }
    : {
        debug: () => {},
        info: (...args: any[]) => console.log.apply(console, args),
        success: (...args: any[]) =>
          console.log.apply(console, args.map(green)),
        error: (...args: any[]) => console.error.apply(console, args.map(red)),
      };
}
