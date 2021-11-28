import { Router } from "express";
import { FileController } from "./controllers/FileController";

const router = Router();

const fileController = new FileController();

router.post("/upload", fileController.upload);
router.post("/delete", fileController.delete);
export { router };
