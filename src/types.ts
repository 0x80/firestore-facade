/**
 * Inspired by
 * https://stackoverflow.com/questions/66655728/property-path-with-template-literal-types
 *
 * and
 * https://stackoverflow.com/questions/69126879/typescript-deep-keyof-of-a-nested-object-with-related-type#answer-69129328
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

type NestedFieldPaths = {
  "a.b"?: { c: string; d?: number; arr: number[] };
  "a.b.c"?: string;
  "a.b.d"?: number;
  "a.b.arr"?: number[];
};

export type Fail_DeepKeyMapOf<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: T[K] extends Array<unknown>
          ? { [key in `${K}`]: T[K] }
          :
              | { [key in `${K}`]: T[K] }
              | { [key in `${K}${DotPrefix<DeepKeyOf<T[K]>>}`]: T[K] };
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, { [key: string]: any }>
  : never;

// export type DeepKeyMap<T> = { [P in DeepKeyOf<T>]?: any };

type Fail_ExampleDocument = {
  a: { b: { c: string; d?: number; arr: number[] } };
  arr: string[];
};

type Fail_DeepKeyOfTest = Fail_DeepKeyMapOf<Fail_ExampleDocument>;
