import * as path from "path";
import * as webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import { RushingStats } from "./src/json-helpers/types";
import normalizePlayerRushingStats from "./src/json-helpers/normalize";
import rushingStatsJSON from "./data/rushing.json";

console.log("Importing Data...");
const cleanedData: Array<RushingStats> = [];
for (const stat of rushingStatsJSON) {
  const normalized = normalizePlayerRushingStats(stat);

  if (normalized.key === "ok" ) {
    cleanedData.push(normalized.stats);
  } else {
    console.log(normalized.msg, normalized.json);
  }
}
console.log("Data Import Complete");

const proxy: WebpackDevServer.ProxyConfigMap = {
  "/rushing-stats": {
    /* eslint-disable */
    // @ts-expect-error: Missing from offical types
    bypass: (req, res) => {
      if (req.headers.accept.indexOf('html') !== -1) {
        return './public/index.html';
      } else if (req.headers.accept.indexOf('css') !== -1) {
        return './public/index.css';
      } else {
        return res.send(JSON.stringify(cleanedData))
      }
    },
  },
}

const config: webpack.Configuration = {
  mode: 'development',
  entry: './src/UI/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    publicPath: "http://localhost:3000/build/",
    proxy,
  },
};

export default config;
