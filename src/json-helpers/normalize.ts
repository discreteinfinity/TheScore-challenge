import { statKeyMap } from "./render";
import { isLng, isNumber, isString } from "./type-guards";
import { Lng, NormalizedMaybe, PlayerJSON, NormalizedError } from "./types";


export default function normalizePlayerRushingStats(json: PlayerJSON): NormalizedMaybe {
    const createError = (
        key: string,
        type: string
    ): NormalizedError => ({
        key: "error",
        json,
        msg:`${key} must be of type ${type}`
    });

    const keyMap = Object.fromEntries(statKeyMap);

    // Player
    const player = json[keyMap.player];
    if (!isString(player)) return createError(keyMap.player, "string");

    // Team
    const team = json[keyMap.team];
    if (!isString(team)) return createError(keyMap.team, "string");

    // Pos
    const pos = json[keyMap.pos];
    if (!isString(pos)) return createError(keyMap.pos, "string");

    // Att
    const att = json[keyMap.att];
    if (!isNumber(att) || !Number.isInteger(att)) return createError(keyMap.att, "integer");

    // Att/G - ints and floats, no strings
    const attG = json[keyMap.attG];
    if (!isNumber(attG)) return createError(keyMap.attG, "number");

    // Yds
    let yds = json[keyMap.yds];
    if (isString(yds)) {
        const cleanedString = yds.replace(/[\s ,]/, "");
        if (/\./.test(cleanedString)) return createError(keyMap.yds, "integer");
        yds = parseInt(cleanedString, 10);
    }
    if (!isNumber(yds) || !Number.isInteger(yds)) return createError(keyMap.yds, "integer");

    // Avg - ints and floats, no strings
    const avg = json[keyMap.avg];
    if (!isNumber(avg)) return createError(keyMap.avg, "number");

    // Yds/G
    const ydsG = json[keyMap.ydsG];
    if (!isNumber(ydsG)) return createError(keyMap.ydsG, "number");

    // TD
    const td = json[keyMap.td];
    if (!isNumber(td) || !Number.isInteger(td)) return createError(keyMap.td, "integer");

    // Lng
    let lng: Lng;
    const dirtyLng = json[keyMap.lng];
    if (isNumber(dirtyLng) && Number.isInteger(dirtyLng)) {
        lng = `${dirtyLng}`;
    } else if (isLng(dirtyLng)) {
        lng = dirtyLng;
    } else {
        return createError(keyMap.lng, "integer or Lng string");
    }

    // 1st
    const first = json[keyMap.first];
    if (!isNumber(first) || !Number.isInteger(first)) return createError(keyMap.first, "integer");

    // 1st%
    const firstPercentage = json[keyMap.firstPercentage];
    if (!isNumber(firstPercentage)) return createError(keyMap.firstPercentage, "number");

    // 20+
    const twentyPlus = json[keyMap.twentyPlus];
    if (!isNumber(twentyPlus) || !Number.isInteger(twentyPlus)) return createError(keyMap.twentyPlus, "integer");

    // 40+
    const fortyPlus = json[keyMap.fortyPlus];
    if (!isNumber(fortyPlus) || !Number.isInteger(fortyPlus)) return createError(keyMap.fortyPlus, "integer");

    // FUM
    const fum = json[keyMap.fum];
    if (!isNumber(fum) || !Number.isInteger(fum)) return createError(keyMap.fum, "integer");

    return {
        key: "ok",
        stats: {
            player,
            team,
            pos,
            att,
            attG,
            yds,
            avg,
            ydsG,
            td,
            lng,
            first,
            firstPercentage,
            twentyPlus,
            fortyPlus,
            fum,
        }
    };
}