export default class Account {
  dbId: string;
  email: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  refresh_token: string;

  constructor(
    dbId : string,
    email: string,
    client_id: string,
    client_secret: string,
    redirect_uri: string,
    refresh_token: string
  ) {
    this.dbId = dbId;
    this.email = email;
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_uri = redirect_uri;
    this.refresh_token = refresh_token;
  }
}
