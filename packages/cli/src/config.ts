/**
 * These types are only required for the generator to iterate over the object.
 * The actual configuration needs to be strictly typed as that one will be used
 * at runtime to resolve the actual types.
 */
type CollectionsDef = {
  [collectionName: string]: Record<string, unknown>;
};

type SubCollectionsDef = {
  [collectionName: string]: {
    [subCollectionName: string]: Record<string, unknown>;
  };
};

export type CollectionsConfig = {
  root: CollectionsDef;
  sub: SubCollectionsDef;
  options: {
    context?: "nodejs" | "web";
  };
};
