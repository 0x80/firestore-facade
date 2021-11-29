import { DocumentA } from "./config";

/**
 * Code *heavily* inspired by
 * https://stackoverflow.com/questions/69126879/typescript-deep-keyof-of-a-nested-object-with-related-type#answer-69129328
 */

type Structure = {
  user: {
    tuple: [42];
    emptyTuple: [];
    array: { age: number }[];
  };
};

type Values<T> = T[keyof T];
{
  // 1 | "John"
  type _ = Values<{ age: 1; name: "John" }>;
}

type IsNever<T> = [T] extends [never] ? true : false;
{
  type _ = IsNever<never>; // true
  type __ = IsNever<true>; // false
}

type IsTuple<T> = T extends Array<any>
  ? T["length"] extends number
    ? number extends T["length"]
      ? false
      : true
    : true
  : false;
{
  type _ = IsTuple<[1, 2]>; // true
  type __ = IsTuple<number[]>; // false
  type ___ = IsTuple<{ length: 2 }>; // false
}

type IsEmptyTuple<T extends Array<any>> = T["length"] extends 0 ? true : false;
{
  type _ = IsEmptyTuple<[]>; // true
  type __ = IsEmptyTuple<[1]>; // false
  type ___ = IsEmptyTuple<number[]>; // false
}

type IsTimestamp<T> = T extends FirebaseFirestore.Timestamp ? true : false;
{
  type _ = IsTimestamp<FirebaseFirestore.Timestamp>; // true
}

/**
 * If Cache is empty return Prop without dot,
 * to avoid ".user"
 */
type HandleDot<
  Cache extends string,
  Prop extends string | number,
> = Cache extends "" ? `${Prop}` : `${Cache}.${Prop}`;

/**
 * Simple iteration through object properties
 */
type HandleObject<Obj, Cache extends string> = {
  [Prop in keyof Obj]:  // concat previous Cache and Prop
    | HandleDot<Cache, Prop & string>
    // with next Cache and Prop
    | Path<Obj[Prop], HandleDot<Cache, Prop & string>>;
}[keyof Obj];

type Path<Obj, Cache extends string = ""> = Obj extends PropertyKey
  ? // return Cache
    Cache
  : // if Obj is Array (can be array, tuple, empty tuple)
  Obj extends Array<unknown>
  ? // and is tuple
    IsTuple<Obj> extends true
    ? // and tuple is empty
      IsEmptyTuple<Obj> extends true
      ? // call recursively Path with `-1` as an allowed index
        Path<PropertyKey, HandleDot<Cache, -1>>
      : // if tuple is not empty we can handle it as regular object
        HandleObject<Obj, Cache>
    : // if Obj is regular  array call Path with union of all elements
      //Path<Obj[number], HandleDot<Cache, number>>
      Cache
  : IsTimestamp<Obj> extends true
  ? Cache
  : // if Obj is neither Array nor Tuple nor Primitive not Timestamp - treat is as object
    HandleObject<Obj, Cache>;

type WithDot<T extends string> = T extends `${string}.${string}` ? T : never;

// "user" | "user.arr" | `user.arr.${number}`
type Test = WithDot<Extract<Path<Structure>, string>>;

type Acc = Record<string, any>;

type ReducerCallback<
  Accumulator extends Acc,
  El extends string,
> = El extends keyof Accumulator
  ? Accumulator[El]
  : El extends "-1"
  ? never
  : Accumulator;

type Reducer<Keys extends string, Accumulator extends Acc = {}> =
  // Key destructure
  Keys extends `${infer Prop}.${infer Rest}`
    ? // call Reducer with callback, just like in JS
      Reducer<Rest, ReducerCallback<Accumulator, Prop>>
    : // this is the last part of path because no dot
    Keys extends `${infer Last}`
    ? // call reducer with last part
      ReducerCallback<Accumulator, Last>
    : never;

{
  type _ = Reducer<"user.arr", Structure>; // []
  type __ = Reducer<"user", Structure>; // { arr: [] }
}

export type FieldPaths<T> = {
  [Prop in WithDot<Extract<Path<T>, string>>]: Reducer<Prop, T>;
};

{
  type _ = FieldPaths<DocumentA>;
}
