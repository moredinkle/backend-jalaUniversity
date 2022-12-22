import { Router } from "express";
import { container } from "../../infraestructure/container";
import { ISnakeRepository } from "../../core/repositories/snake-repository";
import { ISnakeNodeRepository } from "../../core/repositories/snake-node-repository";
import { SNAKE_TYPES } from "../../types/class-types";
import Snake from "../../core/entities/snake";
import SnakeService from "../../core/services/snake-service";

export const snakeRouter = Router();
const snakeService = new SnakeService(
  container.get<ISnakeRepository>(SNAKE_TYPES.SnakeDataAccess)
);

//revisar esto
snakeRouter.get("/snake/:id", (req, res) => {
  try {
    async function readSnake() {
      const id: number = +req.params.id;
      const snake = await snakeService.read(id);
      if (snake) {
        res.status(200).json({ message: "Snake found", data: snake });
      } else {
        res.status(400).json({ message: "Snake not found" });
      }
    }
    readSnake();
  } catch (error) {
    res.status(400).json({ message: "Server error" });
  }
});

snakeRouter.get("/game/snakes/:id", (req, res) => {
  try {
    async function readSnake() {
      const id: number = +req.params.id;
      const snakes = await snakeService.readByGameId(id);
      if (snakes.length > 0) {
        res.status(200).json({ message: "Snake found", data: snakes });
      } else {
        res.status(400).json({ message: "Snake not found" });
      }
    }
    readSnake();
  } catch (error) {
    res.status(400).json({ message: "Server error" });
  }
});

snakeRouter.post("/snake", (req, res, next) => {
  try {
    async function createSnake() {
      const { username, size } = req.body;
      const snake = new Snake(username);
      const newSnakeId = await snakeService.create(snake, size);
      res
        .status(200)
        .json({
          message: "Snake created successfully",
          newSnakeId: newSnakeId,
        });
    }
    createSnake();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

snakeRouter.patch("/snake-direction/:id", (req, res) => {
  try {
    async function readPosition() {
      const { direction } = req.body;
      if (
        direction === "UP" ||
        direction === "DOWN" ||
        direction === "LEFT" ||
        direction === "RIGHT"
      ) {
        const id = +req.params.id;
        let result = await snakeService.updateHeadDirection(id, direction);
        if (result) {
          res
            .status(200)
            .json({ message: "Snake direction modified successfully" });
        } else {
          res.status(400).json({ message: "Snake id or movement incorrect" });
        }
      } else {
        res
          .status(400)
          .json({
            message: "Invalid direction. Only UP, DOWN, LEFT or RIGHT accepted",
          });
      }
    }
    readPosition();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

snakeRouter.delete("/snake/:id", (req, res) => {
  try {
    async function deleteSnake() {
      const id: number = +req.params.id;
      const deleteAffectedRows = await snakeService.delete(id);
      if (deleteAffectedRows > 0) {
        res
          .status(200)
          .json({ message: `Snake with id:${id} deleted succesfully` });
      } else {
        res.status(400).json({ data: "Snake not found" });
      }
    }
    deleteSnake();
  } catch (error) {
    res.status(500).json({ data: "Server error." });
  }
});
