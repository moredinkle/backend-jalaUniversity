import { ObjectId } from 'mongodb';
import Position from "../../../../core/entities/position";
import PositionEntity from "./position.entity";

export class PositionMapper {
  static toDomain(raw: PositionEntity): Position {
    const position = new Position(raw.x, raw.y);
    position.id = raw._id.toString();
    position.occupier = raw.occupier;
    return position;
  }

  static toEntity(raw: Position): PositionEntity {
    const position = new PositionEntity();
    if(raw.id) {
      position._id = new ObjectId(raw.id);
    }
    position.x = raw.x;
    position.y = raw.y;
    position.occupier = raw.occupier;
    return position;
  }
}
