import { DateTime } from "luxon";

export interface IShow {
    Title: string;
    Date: DateTime;
    Role: string;
    MinutesUntil?: number;
}
