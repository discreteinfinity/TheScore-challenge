import { Lng, lngRegex, PlayerJSON, RushingStats } from "./types";

export function isString(val: unknown): val is string {
    return val != null && typeof val === "string";
}

export function isNumber(val: unknown): val is number {
    return val != null && typeof val === "number";
}

export function isLng(lng: unknown): lng is Lng {
    return typeof lng === "string" && lngRegex.test(lng);
}

export function playerRushingStatsValidator(json: PlayerJSON): json is RushingStats {
    return (
        json.player != null && typeof json.player === "string" &&
        json.team != null && typeof json.team === "string" &&
        json.pos != null && typeof json.pos === "string" &&
        json.att != null && typeof json.att === "number" &&
        json.attG != null && typeof json.attG === "number" &&
        json.yds != null && typeof json.yds === "number" &&
        json.avg != null && typeof json.avg === "number" &&
        json.ydsG != null && typeof json.ydsG === "number" &&
        json.td != null && typeof json.td === "number" &&
        json.lng != null && typeof json.lng === "string" &&
        json.first != null && typeof json.first === "number" &&
        json.firstPercentage != null && typeof json.firstPercentage === "number" &&
        json.twentyPlus != null && typeof json.twentyPlus === "number" &&
        json.fortyPlus != null && typeof json.fortyPlus === "number" &&
        json.fum != null && typeof json.fum === "number"
    );
}
