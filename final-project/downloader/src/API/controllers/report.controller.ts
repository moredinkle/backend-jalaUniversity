import { Request, Response, NextFunction } from "express";
import AccountReportService from "../../services/account-report-service";
import FileReportService from "../../services/file-report-service";
import HttpError from "../../utils/http-error";

const fileReportService = new FileReportService();
const accountReportService = new AccountReportService();


export async function readFileReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileId } = req.params;
    const report = await fileReportService.readFileReport(fileId);
    res.status(200).json({
      message: "File report found",
      data: report,
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

export async function readAllFilesReport(req: Request, res: Response, next: NextFunction) {
  try {
    const reports = await fileReportService.readAllFilesReport();
    res.status(200).json({
      message: "Reports found",
      data: reports,
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

export async function readAccountReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { accountId } = req.params;
    const report = await accountReportService.readAccountReport(accountId);
    res.status(200).json({
      message: "Account report found",
      data: report,
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

export async function readAllAccountsReport(req: Request, res: Response, next: NextFunction) {
  try {
    const reports = await accountReportService.readAllAccountsReport();
    res.status(200).json({
      message: "Reports found",
      data: reports,
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
