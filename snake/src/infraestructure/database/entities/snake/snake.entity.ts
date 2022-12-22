import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import SnakeNodeEntity from "../snake-node/snake-node.entity";

@Entity("Snake")
export default class SnakeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  size: number;

  @Column()
  active: boolean;

  @Column()
  gameId: number;

}
