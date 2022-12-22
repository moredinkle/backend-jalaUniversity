import Game from "../entities/Game";

export interface IGameRepository {
  //?
  create(game: Game): Promise<number>;
  read(id: number): Promise<Game>;
  readActiveGames(): Promise<Game[] | undefined>;
  update(game: Game): Promise<void>;
  delete(id: number): Promise<number>;
}
