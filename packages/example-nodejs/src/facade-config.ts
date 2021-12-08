import { Athlete, Medal, SportsEvent } from "./document-types";

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
