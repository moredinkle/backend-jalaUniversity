import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm"

@Entity("Snake")
export default class SnakeEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  username: string;

  @Column()
  size: number;

  @Column()
  active: boolean;
  
  @Column()
  score: number;

  @Column()
  gameId: string;

}
