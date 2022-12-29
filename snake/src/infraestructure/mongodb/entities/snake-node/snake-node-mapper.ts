import SnakeNode from "../../../../core/entities/snake-node";
import SnakeNodeEntity from "./snake-node.entity";
import { ObjectId } from 'mongodb';

export class SnakeNodeMapper {
  static toDomain(raw: SnakeNodeEntity): SnakeNode {
    const snakeNode = new SnakeNode();
    snakeNode.id = raw._id.toString();
    snakeNode.direction = raw.direction;
    snakeNode.x = raw.x;
    snakeNode.y = raw.y;
    return snakeNode;
  }


  static toEntity(raw: SnakeNode): SnakeNodeEntity {
    const snakeNode = new SnakeNodeEntity();
    if(raw.id) {
      snakeNode._id = new ObjectId(raw.id);
    }
    snakeNode.direction = raw.direction;
    snakeNode.x = raw.x;
    snakeNode.y = raw.y;
    snakeNode.snakeId = raw.snakeId;
    return snakeNode;
  }

}
