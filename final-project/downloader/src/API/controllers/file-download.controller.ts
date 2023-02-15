import { Request, Response, NextFunction } from "express";
import FileDownloadService from "../../services/file-download-service";
import HttpError from "../../utils/http-error";

const fileDownloadService = new FileDownloadService();


export async function readOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileDownloadId } = req.params;
    const file = await fileDownloadService.readOne(fileDownloadId);
    res.status(200).json({
      message: "File found",
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

export async function getDownloadUri(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileId } = req.params;
    const downloadUri = await fileDownloadService.getDownloadUri(fileId);
    res.status(200).json({
      message: "Download uri found",
      data: downloadUri,
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

export async function readByUploaderDbId(req: Request, res: Response, next: NextFunction) {
    try {
      const { uploaderDbId } = req.params;
      const files = await fileDownloadService.readbyUploaderDbId(uploaderDbId);
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

export async function readAll(req: Request, res: Response, next: NextFunction) {
  try {
    const files = await fileDownloadService.readAll();
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

