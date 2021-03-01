/// <reference types="jest" />

import normalizePlayerRushingStats from "../src/json-helpers/normalize";
import { isLng, isNumber, isString } from "../src/json-helpers/type-guards";
import { lngRegex } from "../src/json-helpers/types";

describe("String/Number Type Guards", () => {
    const str = "abc";
    const num = 123;

    expect(isString(str)).toBe(true);
    expect(isString(num)).toBe(false);

    expect(isNumber(str)).toBe(false);
    expect(isNumber(num)).toBe(true);
});

describe("Lng Tests", () => {
    const oneT = "1T";
    const one = "1";
    const t = "T";

    const multiT = "1234T";
    const multi = "1234";

    const neg = "-2";

    const float = "1.234";
    const floatT= "1.234T";
    const wrongLetter = "1F";
    const wrongLetter2 = "1TF";

    test("lngRegex", () => {
        expect(lngRegex.test(oneT)).toBe(true);
        const oneTExecArr = lngRegex.exec(oneT) || [] as unknown as RegExpExecArray;
        expect(oneTExecArr[1]).toBe(one);
        expect(oneTExecArr[2]).toBe(t);

        expect(lngRegex.test(one)).toBe(true);
        expect(lngRegex.test(t)).toBe(false);

        expect(lngRegex.test(multiT)).toBe(true);
        const multiTExecArr = lngRegex.exec(multiT) || [] as unknown as RegExpExecArray;
        expect(multiTExecArr[1]).toBe(multi);
        expect(multiTExecArr[2]).toBe(t);

        expect(lngRegex.test(multi)).toBe(true);

        expect(lngRegex.test(neg)).toBe(true);

        expect(lngRegex.test(float)).toBe(false);
        expect(lngRegex.test(floatT)).toBe(false);
        expect(lngRegex.test(wrongLetter)).toBe(false);
        expect(lngRegex.test(wrongLetter2)).toBe(false);

    });

    test("isLng", () => {
        expect(isLng(oneT)).toBe(true);
        expect(isLng(one)).toBe(true);
        expect(isLng(multiT)).toBe(true);
        expect(isLng(multi)).toBe(true);
    
        expect(isLng(t)).toBe(false);
        expect(isLng(123 as unknown as string)).toBe(false);
    });
});

describe("normalizePlayerRushingStats", () => {
    const dirtyJSON = {
        "Player":"Test Player",
        "Team":"ABC",
        "Pos":"YZ",
        "Att":222,
        "Att/G":8,
        "Yds":0,
        "Avg":60,
        "Yds/G":60,
        "TD":9,
        "Lng":"5T",
        "1st":42,
        "1st%":15.9,
        "20+":5,
        "40+":3,
        "FUM":0
    };

    const cleanJSON = {
        player: "Test Player",
        team: "ABC",
        pos: "YZ",
        att: 222,
        attG: 8,
        yds: 0,
        avg: 60,
        ydsG: 60,
        td: 9,
        lng: "5T",
        first: 42,
        firstPercentage: 15.9,
        twentyPlus: 5,
        fortyPlus: 3,
        fum: 0
    };

    test("Player, Team, Pos", () => {
        expect(
            normalizePlayerRushingStats(dirtyJSON)
        ).toStrictEqual({
            key: "ok",
            stats: cleanJSON
        });
    });

    test("Player Errors", () => {
        const json = {
            ...dirtyJSON,
            Player: {},
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "Player must be of type string"
        });
    });

    test("Team Errors", () => {
        const json = {
            ...dirtyJSON,
            Team: {},
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg:"Team must be of type string"
        });
    });

    test("Pos Errors", () => {
        const json = {
            ...dirtyJSON,
            Pos: {},
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "Pos must be of type string"
        });
    });

    test("Att", () => {
        for (const val of [0, 8, 223]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    Att: val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    att: val,
                }
            });
        }
    });
    
    test("Att Errors", () => {
        const json = {
            ...dirtyJSON,
            Att: 222.8,
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "Att must be of type integer"
        });
    });

    test("Att/G", () => {
        for (const val of [0, 0.1, 14.8, 8]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    "Att/G": val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    attG: val,
                }
            });
        }
    });

    test("Att/G Errors", () => {
        const json = {
            ...dirtyJSON,
            "Att/G": "222.8",
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "Att/G must be of type number"
        });
    });

    test("Yds", () => {
        expect(
            normalizePlayerRushingStats({
                ...dirtyJSON,
                Yds: "1,079",
            })
        ).toStrictEqual({
            key: "ok",
            stats: {
                ...cleanJSON,
                yds: 1079,
            }
        });
        
        expect(
            normalizePlayerRushingStats({
                ...dirtyJSON,
                Yds: "360",
            })
        ).toStrictEqual({
            key: "ok",
            stats: {
                ...cleanJSON,
                yds: 360,
            }
        });

        for (const val of [7, -3, 0]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    Yds: val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    yds: val,
                }
            });
        }
    });

    test("Yds Errors", () => {
        const json = {
            ...dirtyJSON,
            Yds: "2.228",
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "Yds must be of type integer"
        });

        const json2 = {
            ...dirtyJSON,
            Yds: 2.228,
        };

        expect(
            normalizePlayerRushingStats(json2)
        ).toStrictEqual({
            key: "error",
            json: json2,
            msg: "Yds must be of type integer"
        });
    });

    test("Avg", () => {
        for (const val of [-16, -0.3, 20.8, 0, 60]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    Avg: val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    avg: val,
                }
            });
        }
    });

    test("Avg Errors", () => {
        const json = {
            ...dirtyJSON,
            Avg: "222.8",
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "Avg must be of type number"
        });
    });

    test("Yds/G", () => {
        for (const val of [-16, -0.3, 20.8, 0, 60]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    "Yds/G": val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    ydsG: val,
                }
            });
        }
    });

    test("Yds/G Errors", () => {
        const json = {
            ...dirtyJSON,
            "Yds/G": "222",
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "Yds/G must be of type number"
        });
    });

    test("TD", () => {
        for (const val of [0, 8, 223]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    TD: val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    td: val,
                }
            });
        }
    });

    test("TD Errors", () => {
        const json = {
            ...dirtyJSON,
            TD: 222.8,
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "TD must be of type integer"
        });
    });

    test("Lng", () => {
        for (const val of [0, -1, 45, "74T", "-2"]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    Lng: val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    lng: `${val}`,
                }
            });
        }
    });

    test("Lng Errors", () => {
        const json = {
            ...dirtyJSON,
            Lng: 222.8,
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "Lng must be of type integer or Lng string"
        });

        const json2 = {
            ...dirtyJSON,
            Lng: "222.8",
        };

        expect(
            normalizePlayerRushingStats(json2)
        ).toStrictEqual({
            key: "error",
            json: json2,
            msg: "Lng must be of type integer or Lng string"
        });
    });

    test("1st", () => {
        for (const val of [0, 8, 223]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    "1st": val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    first: val,
                }
            });
        }
    });

    test("1st Errors", () => {
        const json = {
            ...dirtyJSON,
            "1st": 222.8,
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "1st must be of type integer"
        });
    });

    test("1st%", () => {
        for (const val of [0, 0.1, 14.8, 8]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    "1st%": val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    firstPercentage: val,
                }
            });
        }
    });

    test("1st% Errors", () => {
        const json = {
            ...dirtyJSON,
            "1st%": "222.8",
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "1st% must be of type number"
        });
    });

    test("20+", () => {
        for (const val of [0, 8, 223]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    "20+": val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    twentyPlus: val,
                }
            });
        }
    });

    test("20+ Errors", () => {
        const json = {
            ...dirtyJSON,
            "20+": 222.8,
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "20+ must be of type integer"
        });
    });

    test("40+", () => {
        for (const val of [0, 8, 223]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    "40+": val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    fortyPlus: val,
                }
            });
        }
    });

    test("40+ Errors", () => {
        const json = {
            ...dirtyJSON,
            "40+": 222.8,
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "40+ must be of type integer"
        });
    });

    test("FUM", () => {
        for (const val of [0, 8, 223]) {
            expect(
                normalizePlayerRushingStats({
                    ...dirtyJSON,
                    "FUM": val,
                })
            ).toStrictEqual({
                key: "ok",
                stats: {
                    ...cleanJSON,
                    fum: val,
                }
            });
        }
    });

    test("FUM Errors", () => {
        const json = {
            ...dirtyJSON,
            FUM: 222.8,
        };

        expect(
            normalizePlayerRushingStats(json)
        ).toStrictEqual({
            key: "error",
            json,
            msg: "FUM must be of type integer"
        });
    });
});

