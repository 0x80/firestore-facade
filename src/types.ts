/**
 * Inspired by
 * https://stackoverflow.com/questions/66655728/property-path-with-template-literal-types
 */

export type DeepKeyOf<T> = (
  T extends object
    ? {
        [K in Extract<keyof T, string>]: T[K] extends Array<unknown>
          ? `${K}`
          : `${K}` | `${K}${DotPrefix<DeepKeyOf<T[K]>>}`;
      }[Extract<keyof T, string>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

export type DeepKeyMap<T> = { [P in DeepKeyOf<T>]?: any };

type ExampleDocument = {
  a: { b: { c: string; d?: number; arr: number[] } };
  arr: string[];
};

type DeepKeyOfTest = DeepKeyOf<ExampleDocument>;
