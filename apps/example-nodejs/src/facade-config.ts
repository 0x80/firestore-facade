import { Athlete, Medal, SportsEvent } from "./types.js";

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
  // options: {
  //   useEsm: true,
  // },
};
