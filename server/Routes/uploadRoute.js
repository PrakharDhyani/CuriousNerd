import express from "express"
import multer from "multer"

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
    // console.log(req.body)
    try {
        res.status(200).json("File uploaded successfuly");
    } catch (error) {
        console.log("upload ", error)
    }
})

export default router;