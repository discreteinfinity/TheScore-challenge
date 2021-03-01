import * as React from "react";
import { useState, useEffect } from "react";
import { render } from "react-dom";

import { statKeyMap } from "../json-helpers/render";
import { playerRushingStatsValidator } from "../json-helpers/type-guards";
import { RushingStats, RushingStatsKeys } from "../json-helpers/types";

import Table from "./table";
import { TableSort, defaultSort, totalRushingYdsSort, totalRushingTDSort, longestRushSort } from "./table/sort";
import Download from "./table/download";

const App = () => {
    const [sort, updateSort] = useState<TableSort>(defaultSort);
    const [data, updateData] = useState<Array<RushingStats>>([]);
    const [filter, updateFilter] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch("/rushing-stats")
                .then((res) => res.json())
                .then((json) => {
                    const rushingStats: Array<RushingStats> = [];
                    for (const statObj of json) {
                        if (playerRushingStatsValidator(statObj)) {
                            rushingStats.push(statObj);
                        }
                    }

                    return rushingStats;
                });

            updateData(result);
        };

        fetchData();
    }, []);
    
    const headers = Array.from(statKeyMap.values());
    const keys: Array<RushingStatsKeys> = Array.from(statKeyMap.keys());
    const filteredData = filter == null ?
        data :
        data.filter(
            (stat) => stat.player.toLowerCase().includes(filter.toLowerCase()),
        );
    const rows = filteredData.sort(sort.fn).map((stat) => keys.map((key) => stat[key]));

    return <div className={"App"}>
        <div className={"Control"}>
            <label className={"Label"}>
                Filter by Name:
                <input className={"Filter"} onChange={(e) => updateFilter(e.currentTarget.value.trim())}/>
            </label>
            <label className={"Label"}>
                Sort By:
                <button className={"Filter"} onClick={() => updateSort(defaultSort)}>
                    Name
                </button>
                <button className={"Filter"} onClick={() => updateSort(totalRushingYdsSort)}>
                    Total Rushing Yds
                </button>
                <button className={"Filter"} onClick={() => updateSort(totalRushingTDSort)}>
                    Total Rushing TD
                </button>
                <button className={"Filter"} onClick={() => updateSort(longestRushSort)}>
                    Longest Rush
                </button>
            </label>
        </div>

        <Download headers={headers} rows={rows} />

        <Table
            sort={sort}
            rows={rows}
        />
    </div>;
};

render(<App />, document.getElementById("root"));
