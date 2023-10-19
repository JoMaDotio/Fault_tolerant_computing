"use strict";
// board.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const boards = [];
const router = express_1.default.Router();
// Crear un tablero
router.post('/', (req, res) => {
    const { name, description, ownerId } = req.body;
    const id = Math.random().toString(36).substring(7); // Genera un ID aleatorio
    const newBoard = {
        boardId: Number(id),
        name,
        description,
        userId: ownerId,
    };
    console.log(newBoard);
    boards.push(newBoard);
    res.status(201).json(newBoard);
});
// Obtener todos los tableros
router.get('/', (req, res) => {
    res.json(boards);
});
// Obtener un tablero por ID
router.get('/:id', (req, res) => {
    const boardId = req.params.id;
    const board = boards.find((b) => b.boardId === Number(boardId));
    if (board) {
        res.json(board);
    }
    else {
        res.status(404).json({ message: 'Tablero no encontrado' });
    }
});
// Actualizar un tablero por ID
router.put('/:id', (req, res) => {
    const boardId = req.params.id;
    const { name, description, ownerId } = req.body;
    const boardIndex = boards.findIndex((b) => b.boardId === Number(boardId));
    if (boardIndex !== -1) {
        boards[boardIndex] = Object.assign(Object.assign({}, boards[boardIndex]), { name,
            description, userId: ownerId });
        res.json(boards[boardIndex]);
    }
    else {
        res.status(404).json({ message: 'Tablero no encontrado' });
    }
});
// Eliminar un tablero por ID
router.delete('/:id', (req, res) => {
    const boardId = req.params.id;
    const boardIndex = boards.findIndex((b) => b.boardId === Number(boardId));
    if (boardIndex !== -1) {
        const deletedBoard = boards.splice(boardIndex, 1)[0];
        res.json(deletedBoard);
    }
    else {
        res.status(404).json({ message: 'Tablero no encontrado' });
    }
});
exports.default = router;
