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

/**
 * In the definition we cast bogus objects for each of the document
 * types. This configuration only serves as type information when generating the
 * createFacade function, so it knows how to type each of the collection methods.
 */
export const collectionsDefinition = {
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
