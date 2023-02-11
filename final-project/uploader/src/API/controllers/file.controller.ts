import { Request, Response, NextFunction } from "express";
import multer from "multer";
import File from "../../entities/file";
import FileService from "../../services/file-service";
import HttpError from '../../utils/http-error';

const fileService = new FileService();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { filename, originalname, mimetype,  size } = req.file;
    if(!filename || !originalname || !mimetype || !size) {
      throw new HttpError(400, "Bad request, properties missing");
    }
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
    if(error instanceof HttpError || error instanceof multer.MulterError) {
      next(error);
    }
    else {
      next(new HttpError(400, error.message))
    }
  }
}

export async function readOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileId } = req.params;
    const file = await fileService.readOne(fileId);
    res.status(200).json({
      message: "Account found",
      data: file,
    });
  } catch (error) {
    if(error instanceof HttpError) {
      next(error);
    }
    else {
      next(new HttpError(400, error.message))
    }
  }
}

export async function readAll(req: Request, res: Response, next: NextFunction) {
  try {
    const files = await fileService.readAll();
    res.status(200).json({
      message: "Files found",
      data: files,
    });
  } catch (error) {
    if(error instanceof HttpError) {
      next(error);
    }
    else {
      next(new HttpError(400, error.message))
    }
  }
}


export async function deleteOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileId } = req.params;
    await fileService.deleteOne(fileId);
    res.status(204).json({
      message: "File deleted",
    });
  } catch (error) {
    if(error instanceof HttpError) {
      next(error);
    }
    else {
      next(new HttpError(400, error.message))
    }
  }
}