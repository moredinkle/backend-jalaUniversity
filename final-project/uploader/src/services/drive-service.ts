import { drive_v3, google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import Account from "../entities/account";
import File from "../entities/file";
const fs = require("fs");

export default class DriveService {
  private oauth2Client: OAuth2Client;
  private drive: drive_v3.Drive;

  constructor(account: Account) {
    this.oauth2Client = new google.auth.OAuth2(
      account.client_id,
      account.client_secret,
      account.redirect_uri
    );

    this.oauth2Client.setCredentials({ refresh_token: account.refresh_token });

    this.drive = google.drive({
      version: "v3",
      auth: this.oauth2Client,
    });
  }

  async uploadFile(file: File) {
    try {zzz
      const fileStream = fs.createReadStream(file.dbPath);
      const response = await this.drive.files.create({
        requestBody: {
          name: file.filename,
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: fileStream,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  async  deleteFile(fileId: string) {
    try {
      const response = await this.drive.files.delete({
        fileId: fileId,
      });
      return response.status;
    } catch (error) {
      console.log(error.message);
    }
  }


}
