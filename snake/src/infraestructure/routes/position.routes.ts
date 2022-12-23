import { Router } from "express";
import { container } from "../../infraestructure/container";
import PositionService from "../../core/services/position-service";
import { IPositionRepository } from "../../core/repositories/Position-repository";
import { POSITION_TYPES } from "../../types/class-types";

import Position from "../../core/entities/Position";

export const positionRouter = Router();
const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));

//get una posicion por id
positionRouter.get("/position/:id", (req, res) => {
  try {
    async function readPosition() {
      const id: number = +req.params.id;
      const position = await positionService.readOne(id);

      if (position) {
        res.status(200).json({ data: position });
      } else {
        res.status(400).json({ message: "Position not found" });
      }
    }
    readPosition();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

positionRouter.get("/positions/food", (req, res) => {
  try {
    async function readFoodPosition() {
      const position = await positionService.readByOccupier("FOOD");
      if (position) {
        res.status(200).json({ data: position });
      } else {
        res.status(400).json({ message: "How ?" });
      }
    }
    readFoodPosition();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


positionRouter.get("/positions", (req, res) => {
  try {
    async function readPosition() {
      const positions = await positionService.readAllPositions();
      if (positions.length !== 0) {
        res.status(200).json({ data: positions });
      } else {
        res.status(400).json({ message: "Positions not found" });
      }
    }
    readPosition();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


positionRouter.post("/positions", (req, res) => {
  try {
    async function createPosition() {
      const position = new Position(+req.body.x, +req.body.y);
      const newPosition = await positionService.create(position);
      res.status(200).json({
        message: "Position created successfully",
        newPositionId: newPosition,
      });
    }
    createPosition();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


positionRouter.post("/board/positions", (req, res) => {
  try {
    async function createPositions() {
      const { size } = req.body;
      await positionService.createAllBoardPositions(+size);
      res
        .status(200)
        .json({ message: "Positions for board created successfully" });
    }
    createPositions();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

positionRouter.delete("/position/:id", (req, res) => {
  try {
    async function deletePosition() {
      const id: number = +req.params.id;
      const deleted = await positionService.delete(id);
      if (deleted > 0) {
        res.status(200).json({
          message: `Position with id:${id} deleted succesfully`,
          result: deleted,
        });
      } else {
        res.status(400).json({ message: "Position could not be deleted" });
      }
    }
    deletePosition();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
