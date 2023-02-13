import { drive_v3, google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import Account from "../entities/account";
import File from "../entities/file";
import fs from 'fs';
import stream from "stream";

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

  async uploadFile(file: File, fileBuffer: Buffer) {
    try {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileBuffer);
      
      const response = await this.drive.files.create({
        requestBody: {
          name: file.filename,
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
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

  async generatePublicUrl(fileId: string) {
    try {
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      const result = await this.drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      return result.data;
    } catch (error) {
      console.log(error.message);
    }
  }


}
