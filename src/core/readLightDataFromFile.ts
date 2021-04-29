import fs from "fs";
import path, { resolve } from "path";

export default function getDataTreeFromFile() {
  const filePath = path.normalize(
    `C:\\Users\\Jakob Schubert\\Desktop\\music_juggling\\Ball1.txt`
  );

  let content = fs.readFileSync(filePath, { encoding: "utf-8" });
  const parse = require("csv-parse/lib/sync");
  const records = parse(content, {
    delimiter: "\t",
  });

  const createTree = require("functional-red-black-tree");
  let tree = createTree();
  for (let line of records) {
    tree = tree.insert(parseFloat(line[0]), line[2]);
  }
  return tree;
}
