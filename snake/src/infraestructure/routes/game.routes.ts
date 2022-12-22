import { Router } from "express";
import { container } from "../../infraestructure/container";
import { IGameRepository } from "../../core/repositories/game-repository";
import { GAME_TYPES } from "../../types/class-types";
import Game from "../../core/entities/Game";
import GameService from "../../core/services/game-service";

export const gameRouter = Router();
const gameService = new GameService(
  container.get<IGameRepository>(GAME_TYPES.GameDataAccess)
);

//revisar esto
gameRouter.get("/game/:id", (req, res) => {
  try {
    async function readGame() {
      const id: number = +req.params.id;
      const game = await gameService.read(id);
      if (game) {
        res.status(200).json({ message: "Game found", data: game });
      } else {
        res.status(400).json({ message: "Game not found" });
      }
    }
    readGame();
  } catch (error) {
    res.status(400).json({ message: "Server error" });
  }
});

gameRouter.get("/game/start/:id", (req, res) => {
  try {
    async function startGame() {
      const { username } = req.body;
      const { id } = req.params;
      const gameId = parseInt(id);
      const game = await gameService.start(username, gameId);
      if (game) {
        res.status(200).json({ message: "Game started", data: game });
      } else {
        res.status(400).json({ message: "Cant start an already started game" });
      }
    }
    startGame();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

gameRouter.get("/game/restart/:id", (req, res) => {
  try {
    async function startGame() {
      const { id } = req.params;
      let gameId = parseInt(id);
      let newGameId = await gameService.restart(gameId);
      res
        .status(200)
        .json({
          message: "Game restarted. Use the new id to track the game.",
          newId: newGameId,
        });
    }
    startGame();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

gameRouter.post("/game", (req, res, next) => {
  try {
    async function createGame() {
      const { size } = req.body;
      const game = new Game(size);
      game.boardSize = size;
      const newGameId = await gameService.create(game);
      res
        .status(200)
        .json({
          message:
            "Game created successfully. Use the game id to start the game.",
          newGameId: newGameId,
        });
    }
    createGame();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

gameRouter.get("/game/update-board/:id", (req, res) => {
  try {
    async function updateBoard() {
      const id = +req.params.id;
      const board = await gameService.updateBoardState(id);
      if (board) {
        res
          .status(200)
          .json({ message: "Game state modified successfully", data: board });
      } else {
        res
          .status(400)
          .json({
            message:
              "Game finished. Snakes crashed or snake crashed into itself.",
          });
      }
    }
    updateBoard();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

gameRouter.delete("/game/:id", (req, res) => {
  try {
    async function deleteGame() {
      const id: number = +req.params.id;
      const deleteAffectedRows = await gameService.delete(id);
      if (deleteAffectedRows > 0) {
        res
          .status(200)
          .json({ message: `Game with id:${id} deleted succesfully` });
      } else {
        res.status(400).json({ data: "Game not found" });
      }
    }
    deleteGame();
  } catch (error) {
    res.status(500).json({ data: "Server error." });
  }
});
