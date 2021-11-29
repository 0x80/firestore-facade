type DocumentA = {
  a: string;
  b: number;
  nested: {
    c: boolean;
    d: string[];
  };
  updated_at?: FirebaseFirestore.Timestamp;
};

type DocumentB = {
  ba: string;
  bb: number;
};

type DocumentSub = {
  zz: string;
};

/**
 * In the definition we cast bogus objects for each of the document
 * types. This configuration only serves as type information when generating the
 * createFacade function, so it knows how to type each of the collection methods.
 */
export const collectionsDefinition = {
  root: {
    collection_a: {} as DocumentA,
    collection_b: {} as DocumentB,
  },
  sub: {
    collection_a: {
      collection_sub: {} as DocumentSub,
    },
  },
};
