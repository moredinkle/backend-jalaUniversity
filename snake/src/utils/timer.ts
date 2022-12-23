import {GAME_TYPES} from "../types/class-types";
import GameService from "../core/services/game-service";
import { IGameRepository } from "../core/repositories/game-repository";
import { container } from '../infraestructure/container';

let gameTimer: NodeJS.Timer | undefined

export function setIntervalTime(interval: number, gameId: number){
    const intervalInSeconds = interval*1000;
    gameTimer = setInterval(updateGame, intervalInSeconds, gameId);
}


async function updateGame(gameId: number){
    const gameService = new GameService(container.get<IGameRepository>(GAME_TYPES.GameDataAccess));
    await gameService.updateBoardState(gameId);
    console.log("game updated");
}

export function stopInterval() {
    clearInterval(gameTimer);
    console.log("game finished");
}
