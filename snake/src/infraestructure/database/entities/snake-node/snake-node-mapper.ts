import SnakeNode from "../../../../core/entities/snake-node";
import SnakeNodeEntity from "./snake-node.entity";

export class SnakeNodeMapper {
  static toDomain(raw: SnakeNodeEntity): SnakeNode {
    const snakeNode = new SnakeNode();
    snakeNode.id = raw.id;
    snakeNode.direction = raw.direction;
    snakeNode.x = raw.x;
    snakeNode.y = raw.y;
    return snakeNode;
  }

  static toEntity(raw: SnakeNode): SnakeNodeEntity {
    const snakeNode = new SnakeNodeEntity();
    snakeNode.id = raw.id;
    snakeNode.direction = raw.direction;
    snakeNode.x = raw.x;
    snakeNode.y = raw.y;
    return snakeNode;
  }
}
