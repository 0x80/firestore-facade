export function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

export function last<T>(array: T[]) {
  assert(array.length > 0, "Called last() on empty array");

  return array[array.length - 1];
}
