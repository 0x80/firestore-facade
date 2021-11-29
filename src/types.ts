/**
 * Inspired by
 * https://stackoverflow.com/questions/66655728/property-path-with-template-literal-types
 */

// Original code: export type DeepKeyOf<T> = ( [T] extends [never]
//     ? ""
//     : T extends object
//     ? {
//         [K in Exclude<keyof T, symbol>]: `${K}${undefined extends T[K]
//           ? "?"
//           : ""}${DotPrefix<DeepKeyOf<T[K]>>}`;
//       }[Exclude<keyof T, symbol>]
//     : ""
// ) extends infer D ? Extract<D, string> : never;

/**
 * The original code procuses paths with ? in them for optional properties. That
 * would not make sense in the context of Firestore update paths so it was
 * removed.
 */
export type DeepKeyOf<T> = (
  [T] extends [never]
    ? ""
    : T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DeepKeyOf<T[K]>>}`;
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type ExampleDocument = {
  a: { b: { c: string; d?: number; nested_arr: number[] } };
  arr: string[];
};

/**
 * This gives type:
 * "a.b.c" | "a.b.d" | "a.b.nested_arr.length" |
 * `a.b.nested_arr.${number}` | "arr.length" | `arr.${number}`
 *
 * I am trying to get to:
 * "a.b.c" | "a.b.d" | "a.b.nested_arr.length" |
 * `a.b.nested_arr.[${number}]` | "arr.length" | `arr.${number}`
 *
 */
type DeepKeyOfTest = DeepKeyOf<ExampleDocument>;
