import AVLTree from "binary-search-tree";
import fs from "fs";
import path, { resolve } from "path";

export default function getDataTreeFromFile(): AVLTree {
  const filePath = path.normalize(
    `C:\\Users\\Jakob Schubert\\Desktop\\music_juggling\\Ball1.txt`
  );

  let AVLTree = require("binary-search-tree").AVLTree;
  let currentSongLightData = new AVLTree({ unique: true });
  let content = fs.readFileSync(filePath, { encoding: "utf-8" });
  const parse = require("csv-parse/lib/sync");
  const records = parse(content, {
    delimiter: "\t",
  });

  for (let line of records) {
    currentSongLightData.insert(line[0], line[2]);
  }

  //Debug
  console.log(records);
  console.log("Interesting:");
  const relevantKeyframes = currentSongLightData.betweenBounds({
    $lte: 200,
    $gt: 190,
  });
  console.log(currentSongLightData);
  console.log(relevantKeyframes);
  //Debug End
  return currentSongLightData;
}
