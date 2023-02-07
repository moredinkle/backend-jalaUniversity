import { Request, Response } from "express";
import File from "../../entities/file";
import FileService from "../../services/file-service";

const fileService = new FileService();

export async function create(req: Request, res: Response) {
  try {
    const { filename, originalname, mimetype,  size } = req.file;
    const file = new File(
        filename,
        originalname,
        size,
        mimetype,
        "REPLICATING"
    );
    const newFileId = await fileService.create(file);
    res.status(201).json({
      message: "File saved successfully",
      newFileId: newFileId,
    });
  } catch (error) {
    res.status(error.status);
    res.send(error.message);
  }
}