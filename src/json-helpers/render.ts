import { RushingStatsKeys } from "./types";

export const statKeyMap = new Map<RushingStatsKeys, string>([
    ["player", "Player"],
    ["team", "Team"],
    ["pos", "Pos"],
    ["att", "Att"],
    ["attG", "Att/G",],
    ["yds", "Yds"],
    ["avg", "Avg",],
    ["ydsG", "Yds/G",],
    ["td", "TD"],
    ["lng", "Lng"],
    ["first", "1st"],
    ["firstPercentage", "1st%"],
    ["twentyPlus", "20+"],
    ["fortyPlus", "40+"],
    ["fum", "FUM"],
]);
