// upload.js em middlewares
import multer from "multer";
// import path from "path";

// // Configuração do storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../../uploads")); // pasta uploads na raiz
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//   },
// });

// const upload = multer({ storage });

const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;