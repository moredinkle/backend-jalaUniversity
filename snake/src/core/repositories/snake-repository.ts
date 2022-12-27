import Snake from "../entities/snake";

export interface ISnakeRepository {
  create(snake: Snake): Promise<string>;
  read(id: string): Promise<Snake | undefined>;
  readActiveSnakes(): Promise<Snake[] | undefined>;
  readByGameId(gameId: string): Promise<Snake[] | undefined>;
  readLeaderboard(): Promise<Snake[] | undefined>;
  update(snake: Snake): Promise<void>;
  delete(id: string): Promise<number>;
}
