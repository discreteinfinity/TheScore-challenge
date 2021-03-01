import { lngRegex, RushingStats } from "../../json-helpers/types";

interface SortBase {
    fn: (a: RushingStats, b: RushingStats) => number;
}

interface DefaultSort extends SortBase {
    key: "default";
}

interface TotalRushingYdsSort extends SortBase {
    key: "totalRushingYds";
}

interface LongestRushSort extends SortBase {
    key: "longestRush";
}

interface TotalRushingTDSort extends SortBase {
    key: "totalRushingTD";
}

interface PlayerFilter extends SortBase {
    key: "playerFilter";
}

export type TableSort = 
    TotalRushingYdsSort |
    LongestRushSort |
    TotalRushingTDSort |
    DefaultSort |
    PlayerFilter;

export const defaultSort: DefaultSort = {
    key: "default",
    // sort Alphabetical by Last Name
    fn: (a: RushingStats, b: RushingStats) => {
        const aName = a.player.split(" ").pop();
        const bName = b.player.split(" ").pop();

        if (aName == null || bName == null) {
            return NaN;
        }

        if (aName < bName) {
            return -1;
        }
        
        if (aName > bName) {
            return 1;
        }

        return 0;
    }
};

export const totalRushingYdsSort: TotalRushingYdsSort = {
    key: "totalRushingYds",
    fn: (a: RushingStats, b: RushingStats) => {
        const aYds = a.yds;
        const bYds = b.yds;

        if (aYds == null || bYds == null) {
            return NaN;
        }

        if (aYds < bYds) {
            return 1;
        }
        
        if (aYds > bYds) {
            return -1;
        }

        return 0;
    }
};

export const longestRushSort: LongestRushSort = {
    key: "longestRush",
    fn: (a: RushingStats, b: RushingStats) => {
        const getInt = (lng: string) => {
            const exec = lngRegex.exec(lng);
            return exec != null ? parseInt(exec[1], 10) : NaN;
        };
        const aLngInt = getInt(a.lng);
        const bLngInt = getInt(b.lng);

        if (aLngInt < bLngInt) {
            return 1;
        }
        
        if (aLngInt > bLngInt) {
            return -1;
        }

        return 0;
    }
};

export const totalRushingTDSort: TotalRushingTDSort = {
    key: "totalRushingTD",
    fn: (a: RushingStats, b: RushingStats) => {
        const aTD = a.td;
        const bTD = b.td;

        if (aTD == null || bTD == null) {
            return 0;
        }

        if (aTD < bTD) {
            return 1;
        }
        
        if (aTD > bTD) {
            return -1;
        }

        return 0;
    }
};
