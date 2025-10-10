import multer from "multer";

// Upload em memória para Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
