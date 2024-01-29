import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileRemover = async (filename) => {
  try {
    await fs.unlink(path.join(__dirname, "../uploads", filename));
    console.log(`File ${filename} removed`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`File ${filename} doesn't exist`);
    } else {
      console.log(`Error occurred while trying to remove file ${filename}`);
    }
  }
};

export { fileRemover };
