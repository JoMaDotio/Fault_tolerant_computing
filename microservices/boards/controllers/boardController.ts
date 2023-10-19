// board.controller.ts

import express, { Request, Response } from 'express';
import { Board } from '../models/boardModel';

const boards: Board[] = []

const router = express.Router();

// Crear un tablero
router.post('/', (req: Request, res: Response) => {
  const { name, description, ownerId } = req.body;
  const id = Math.random().toString(36).substring(7); // Genera un ID aleatorio

  const newBoard: Board = {
    boardId: Number(id),
    name,
    description,
    userId: ownerId,
  };

  console.log(newBoard)

  boards.push(newBoard);
  res.status(201).json(newBoard);
});

// Obtener todos los tableros
router.get('/', (req: Request, res: Response) => {
  res.json(boards);
});

// Obtener un tablero por ID
router.get('/:id', (req: Request, res: Response) => {
  const boardId = req.params.id;
  const board = boards.find((b) => b.boardId === Number(boardId));

  if (board) {
    res.json(board);
  } else {
    res.status(404).json({ message: 'Tablero no encontrado' });
  }
});

// Actualizar un tablero por ID
router.put('/:id', (req: Request, res: Response) => {
  const boardId = req.params.id;
  const { name, description, ownerId } = req.body;
  const boardIndex = boards.findIndex((b) => b.boardId === Number(boardId));

  if (boardIndex !== -1) {
    boards[boardIndex] = {
      ...boards[boardIndex],
      name,
      description,
      userId: ownerId,
    };
    res.json(boards[boardIndex]);
  } else {
    res.status(404).json({ message: 'Tablero no encontrado' });
  }
});

// Eliminar un tablero por ID
router.delete('/:id', (req: Request, res: Response) => {
  const boardId = req.params.id;
  const boardIndex = boards.findIndex((b) => b.boardId === Number(boardId));

  if (boardIndex !== -1) {
    const deletedBoard = boards.splice(boardIndex, 1)[0];
    res.json(deletedBoard);
  } else {
    res.status(404).json({ message: 'Tablero no encontrado' });
  }
});

export default router;
