import { Router } from "express";
import { AppDataSource } from "../../infraestructure/database/data-source";
import { container } from "../../infraestructure/container";
import { ISnakeNodeRepository } from "../../core/repositories/snake-node-repository";
import { SNAKE_NODE_TYPES } from "../../types/class-types";
import SnakeNode from "../../core/entities/snake-node";
import SnakeNodeService from "../../core/services/snake-node-service";

export const snakeNodeRouter = Router();
const snakeNodeService = new SnakeNodeService(
  container.get<ISnakeNodeRepository>(SNAKE_NODE_TYPES.SnakeNodeDataAccess)
);

//revisar esto
snakeNodeRouter.get("/snake-node/:id", (req, res) => {
  try {
    async function readSnakeNode() {
      const id: number = +req.params.id;
      const snakeNode = await snakeNodeService.read(id);
      if (snakeNode) {
        res.status(200).json({ message: "SnakeNode found", data: snakeNode });
      } else {
        res.status(400).json({ message: "SnakeNode not found" });
      }
    }
    readSnakeNode();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//TODO error handling
snakeNodeRouter.post("/snake-node", (req, res, next) => {
  try {
    async function createSnakeNode() {
      const { x, y } = req.body;
      const snakeNode = new SnakeNode();
      snakeNode.x = x;
      snakeNode.y = y;
      const newSnakeNodeId = await snakeNodeService.create(snakeNode);
      res
        .status(200)
        .json({
          message:
            "SnakeNode created successfully. Use the newSnakeNodeId to start a new game.",
          newSnakeNodeId: newSnakeNodeId,
        });
    }
    createSnakeNode();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

snakeNodeRouter.delete("/snake-node/:id", (req, res) => {
  try {
    async function deleteSnakeNode() {
      const id: number = +req.params.id;
      const deleteAffectedRows = await snakeNodeService.delete(id);
      if (deleteAffectedRows > 0) {
        res
          .status(200)
          .json({ message: `SnakeNode with id:${id} deleted succesfully` });
      } else {
        res.status(400).json({ data: "SnakeNode not found" });
      }
    }
    deleteSnakeNode();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
