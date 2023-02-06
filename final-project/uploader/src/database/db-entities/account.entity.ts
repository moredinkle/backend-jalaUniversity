import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Account")
export default class AccountEntity {
  @PrimaryGeneratedColumn()
  dbId: string;
  @Column()
  email: string;
  @Column()
  client_id: string;
  @Column()
  client_secret: string;
  @Column()
  redirect_uri: string;
  @Column()
  refresh_token: string;
}
