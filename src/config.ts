export type Athlete = {
  name: string;
  age: number;
  skills: {
    c: boolean;
    d: string[];
    tuple: [string, number];
  };
  updated_at?: FirebaseFirestore.Timestamp;
};

type Event = {
  name: string;
  year: number;
};

type Medal = {
  event_id: string;
  type: "bronze" | "silver" | "gold";
};

export type CollectionDocumentTypes = {
  root: {
    athletes: Athlete;
    events: Event;
  };
  sub: {
    athletes: {
      medals: Medal;
    };
  };
};

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
};

/**
 * In the definition we cast bogus objects for each of the document
 * types. This configuration only serves as type information when generating the
 * createFacade function, so it knows how to type each of the collection methods.
 */
export const collectionDocumentTypes = {
  root: {
    athletes: {} as Athlete,
    events: {} as Event,
  },
  sub: {
    athletes: {
      medals: {} as Medal,
    },
  },
};
