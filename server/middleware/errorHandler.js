import multer from "multer";

export default function errorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
      // MulterError indicates an error during file upload (e.g., invalid file type)
      res.status(400).json({ error: err.message });
    } else if (err) {
      // Any other type of error
      res.status(500).json({ error: "Server error" });
    } else {
      // If no error occurred, proceed to the next middleware
      next();
    }
  }
  