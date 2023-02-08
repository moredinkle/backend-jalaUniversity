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
    const newFileData = await fileService.create(file);
    res.status(201).json({
      message: "File saved successfully",
      data: newFileData,
    });
  } catch (error) {
    res.status(error.status);
    res.send(error.message);
  }
}

export async function readOne(req: Request, res: Response) {
  try {
    const { fileId } = req.params;
    const file = await fileService.readOne(fileId);
    res.status(200).json({
      message: "Account found",
      data: file,
    });
  } catch (error) {
    error.message === "File not found" ? error.status = 400 : error.status = 500;
    res.status(error.status);
    res.send(error.message);
  }
}

export async function readAll(req: Request, res: Response) {
  try {
    const files = await fileService.readAll();
    res.status(200).json({
      message: "Files found",
      data: files,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}


export async function deleteOne(req: Request, res: Response) {
  try {
    const { fileId } = req.params;
    await fileService.deleteOne(fileId);
    res.status(200).json({
      message: "File deleted",
    });
  } catch (error) {
    error.message === "File not found" ? error.status = 400 : error.status = 500;
    res.status(error.status);
    res.send(error.message);
  }
}