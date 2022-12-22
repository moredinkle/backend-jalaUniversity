import Position from "../../../../core/entities/position";
import PositionEntity from "./position.entity";

export class PositionMapper {
  static toDomain(raw: PositionEntity): Position {
    const position = new Position(raw.x, raw.y);
    position.id = raw.id;
    position.occupier = raw.occupier;
    return position;
  }
}
