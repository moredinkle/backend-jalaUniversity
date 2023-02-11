import { Request, Response, NextFunction } from "express";
import FileDownloadService from "../../services/file-download-service";
import HttpError from "../../utils/http-error";

const fileDownloadService = new FileDownloadService();


export async function readOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileDownloadId } = req.params;
    const account = await fileDownloadService.readOne(fileDownloadId);
    res.status(200).json({
      message: "File found",
      data: account,
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
        message: "File found",
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
      message: "Accounts found",
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
