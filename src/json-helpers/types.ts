export type PlayerJSON = {[key: string]: unknown};

export interface RushingStatsBase {
    player: string;
    team: string;
    pos: string;
    att: number;
    attG: number;
    yds: number;
    avg: number;
    ydsG: number;
    td: number;
    lng: string;
    first: number;
    firstPercentage: number;
    twentyPlus: number;
    fortyPlus: number;
    fum: number;
}
export type RushingStatsKeys = keyof RushingStatsBase;
export interface RushingStats extends RushingStatsBase {
    [key: string]: RushingStatsBase[keyof RushingStatsBase];
}

export interface InvalidJSON {
    json: PlayerJSON;
    msg: string;
}

export interface NormalizedOK {
    key: "ok";
    stats: RushingStats;
}

export interface NormalizedError {
    key: "error";
    json: PlayerJSON;
    msg: string;
}

export type NormalizedMaybe = NormalizedOK | NormalizedError;

// `T` represents a touchdown occurred
export const lngRegex = /^(-?\d+)(T?)$/;
export type Lng = string;