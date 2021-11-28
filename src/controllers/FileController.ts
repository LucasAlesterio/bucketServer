import { Request, Response } from "express";
import fs from "fs";
import { AppError } from "../errors/AppError";
import "dotenv/config";
class FileController {
    async upload(request: Request, response: Response) {
        const { names, images, path } = request.body;
        const { authorization } = request.headers;
        if (authorization !== process.env.KEY) {
            throw new AppError("Invalid key", 401);
        }
        if (
            !names ||
            !images ||
            !path ||
            typeof names !== "object" ||
            typeof images !== "object"
        ) {
            throw new AppError("Invalid data");
        }
        if (images.length !== names.length || names.length === 0) {
            throw new AppError(
                "The amount of names and images must be the same"
            );
        }
        const compleatPath = path.reduce(
            (initial: string, current: string) => {
                const newPath = `${initial}/${current}`;
                if (!fs.existsSync(newPath)) {
                    fs.mkdirSync(newPath);
                }
                return newPath;
            },
            ["./public"]
        );
        await new Promise((resolve, reject) => {
            try {
                names.forEach((name, index) => {
                    const filePath = `${compleatPath}/${name}.png`;
                    const base64 = images[index].split(";base64,").pop();
                    fs.writeFile(
                        filePath,
                        base64,
                        { encoding: "base64" },
                        (err) => {
                            if (err) {
                                reject(`Error to upload image ${index}`);
                            }
                            resolve(201);
                        }
                    );
                });
            } catch (error) {
                throw new Error(error);
            }
        });
        return response.status(201).json({
            message: "Images uploaded",
        });
    }
    async delete(request: Request, response: Response) {
        const { names, path } = request.body;
        const { authorization } = request.headers;
        if (authorization !== process.env.KEY) {
            throw new AppError("Invalid key", 401);
        }
        if (!names || !path) {
            throw new AppError("Invalid data");
        }
        const compleatPath = path.reduce(
            (initial: string, current: string) => {
                const newPath = `${initial}/${current}`;
                return newPath;
            },
            ["./public"]
        );
        await new Promise((resolve, reject) => {
            try {
                names.forEach((name: string) => {
                    const filePath = `${compleatPath}/${name}.png`;
                    fs.rm(filePath, (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(200);
                    });
                });
            } catch (error) {
                throw new Error(error);
            }
        });
        return response.status(200).json({
            message: "Images deleted",
        });
    }
}
export { FileController };
