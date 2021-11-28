import { Request, Response } from "express";
import fs from "fs";
import { AppError } from "../errors/AppError";
class FileController {
    async upload(request: Request, response: Response) {
        const { name, image, path } = request.body;
        if (!name || !image || !path) {
            throw new AppError("Invalid data");
        }
        const compleatPath = path.reduce(
            (intial, current) => {
                const newPath = `${intial}/${current}`;
                if (!fs.existsSync(newPath)) {
                    fs.mkdirSync(newPath);
                }
                console.log(newPath);
                return newPath;
            },
            ["./public"]
        );
        const filePath = `${compleatPath}/${name}.png`;
        const base64 = image.split(";base64,").pop();
        await new Promise((resolve, reject) => {
            fs.writeFile(filePath, base64, { encoding: "base64" }, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(200);
            });
        });
        return response.status(200).json({
            message: "Image uploaded",
        });
    }
}
export { FileController };
