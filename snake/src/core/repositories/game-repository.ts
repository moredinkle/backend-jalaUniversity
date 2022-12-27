import Game from "../entities/Game";

export interface IGameRepository {
  //?
  create(game: Game): Promise<string>;
  read(id: string): Promise<Game>;
  readActiveGames(): Promise<Game[] | undefined>;
  update(game: Game): Promise<void>;
  delete(id: string): Promise<number>;
}
