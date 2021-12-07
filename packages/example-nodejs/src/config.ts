import { Athlete, Medal, SportsEvent } from "./document-types";

/**
 * In the definition we cast bogus objects for each of the document
 * types. This configuration only serves as type information when generating the
 * createFacade function, so it knows how to type each of the collection methods.
 */
export default {
  root: {
    athletes: {} as Athlete,
    sports_events: {} as SportsEvent,
  },
  sub: {
    athletes: {
      medals: {} as Medal,
    },
  },
};
