import * as React from "react";

import { statKeyMap } from "../../json-helpers/render";
import { TableSort } from "./sort";

interface TableProps {
    sort: TableSort;
    rows: Array<Array<number | string>>;
}

export const Table = (props: TableProps): JSX.Element => {
    const headers = Array.from(statKeyMap.entries(), ([key, label]) => <th key={key}>{label}</th>);
    const body = props.rows.map((row) => (
        <tr key={`${row.toString()}`}>
            {row.map((cell, i) => {
                return <td className={"Cell"} key={`${cell}-${i}`}>{cell}</td>;
            })}
        </tr>
    ));

    return (
        <div className={"Table-Container"}>
            <table className={"Table"}>
                <thead>
                    <tr>
                        {headers}
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
