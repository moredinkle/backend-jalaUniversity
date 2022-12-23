import Snake from "../entities/snake";

export interface ISnakeRepository {
  create(snake: Snake): Promise<number>;
  read(id: number): Promise<Snake | undefined>;
  readActiveSnakes(): Promise<Snake[] | undefined>;
  readByGameId(gameId: number): Promise<Snake[] | undefined>;
  readLeaderboard(): Promise<Snake[] | undefined>;
  update(snake: Snake): Promise<void>;
  delete(id: number): Promise<number>;
}
