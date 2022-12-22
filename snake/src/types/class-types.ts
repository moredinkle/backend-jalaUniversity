const BOARD_TYPES = {
  BoardDataAccess: Symbol.for("BoardDataAccess"),
  BoardService: Symbol.for("BoardService"),
  BoardRepository: Symbol.for("BoardRepository"),
};

const POSITION_TYPES = {
  PositionDataAccess: Symbol.for("PositionDataAccess"),
  PositionService: Symbol.for("PositionService"),
  PositionRepository: Symbol.for("PositionRepository"),
};

const SNAKE_TYPES = {
  SnakeDataAccess: Symbol.for("SnakeDataAccess"),
  SnakeService: Symbol.for("SnakeService"),
  SnakeRepository: Symbol.for("SnakeRepository"),
};

const SNAKE_NODE_TYPES = {
  SnakeNodeDataAccess: Symbol.for("SnakeNodeDataAccess"),
  SnakeNodeService: Symbol.for("SnakeNodeService"),
  SnakeNodeRepository: Symbol.for("SnakeNodeRepository"),
};

const GAME_TYPES = {
  GameDataAccess: Symbol.for("GameDataAccess"),
  GameService: Symbol.for("GameService"),
  GameRepository: Symbol.for("GameRepository"),
};


export { BOARD_TYPES, POSITION_TYPES, SNAKE_TYPES, SNAKE_NODE_TYPES, GAME_TYPES };
