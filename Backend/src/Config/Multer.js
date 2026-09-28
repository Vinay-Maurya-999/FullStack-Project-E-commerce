import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 7,
    fileSize: 7 * 1024 * 1024,
  },
});
