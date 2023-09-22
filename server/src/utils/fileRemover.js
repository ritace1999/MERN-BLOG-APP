import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fileRemover = (filename) => {
  fs.unlink(path.join(__dirname, "../uploads", filename), (err) => {
    if (err && err.code == "ENOENT") {
      console.log(`File ${filename} doesn't exist.`);
    } else if (err) {
      console.log(`Error occurred while trying to remove file ${filename}`);
    } else {
      console.log(`Removed ${filename}`);
    }
  });
};
