import { copyFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const indexPath = new URL("../dist/index.html", import.meta.url);
const notFoundPath = new URL("../dist/404.html", import.meta.url);

await access(indexPath, constants.F_OK);
await copyFile(indexPath, notFoundPath);
