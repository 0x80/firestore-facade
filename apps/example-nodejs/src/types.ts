import { Timestamp } from "firebase-admin/firestore";

/**
 * These would be your collection document types. They can be anything and
 * defined anywhere in your repo. The config file will import them and tie them
 * to each collection name.
 */
export type Athlete = {
  name: string;
  age: number;
  skills: {
    c: boolean;
    d: string[];
    tuple: [string, number];
  };
  phone_number?: string;
  updated_at?: Timestamp;
};

export type SportsEvent = {
  name: string;
  year: number;
};

export type Medal = {
  event_id: string;
  type: "bronze" | "silver" | "gold";
};
