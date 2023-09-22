import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Function to generate a random number
const generateRandomNumber = () => {
  return Math.floor(Math.random() * 1000000); // Adjust the range as needed
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const randomFileName = generateRandomNumber(); // Generate a random number
    const ext = path.extname(file.originalname);
    const fileName = `${randomFileName}${ext}`;
    cb(null, fileName);
  },
});

const uploadPic = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1000000, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      // Return an error if the file extension is not allowed
      return cb(new Error("Only images (png, jpg, jpeg) are allowed"));
    }
    cb(null, true); // Accept the file
  },
});

export { uploadPic };
