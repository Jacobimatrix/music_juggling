import fs from "fs";
import path, { resolve } from "path";

export default function getDataTreeFromFile(filePath: string) {
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
