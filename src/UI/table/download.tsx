import * as React from "react";
import { saveAs } from "file-saver";

const csvStringify = (arr: Array<string | number>) => arr.reduce((acc: Array<string>, header, index, arr) => {
    acc.push(`${header}`);
    if (arr.length - 1 === index) {
        acc.push("\n");
    } else {
        acc.push(",");
    }

    return acc;
}, []);

interface DownloadProps {
    headers: Array<string>;
    rows: Array<Array<string | number>>;
}

const Download = (props: DownloadProps): JSX.Element => <button className={"Download"} onClick={() => {
    const headers = csvStringify(props.headers);
    const rows = props.rows.flatMap(csvStringify);

    const file = new File(
        [...headers, ...rows],
        "rushing-stats.csv",
        {type: "text/csv;charset=utf-8"},
    );

    saveAs(file);
}}>Download CSV</button>;

export default Download;
