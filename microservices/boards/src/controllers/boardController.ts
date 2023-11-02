import express, { Request, Response } from 'express';
import { Board } from '../models/boardModel';
import sqlite3 from 'sqlite3';

const router = express.Router();
const db = new sqlite3.Database('boards.db');

// Crea una tabla para los tableros si no existe
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS boards (boardId INTEGER PRIMARY KEY, name TEXT, description TEXT, userId INTEGER)");
});

router.post('/', (req: Request, res: Response) => {
    const { name, description, ownerId } = req.body;

    db.run("INSERT INTO boards (name, description, userId) VALUES (?, ?, ?)", [name, description, ownerId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al insertar el tablero en la base de datos' });
        } else {
            const newBoard: Board = {
                boardId: this.lastID, // Obtén el ID generado para el nuevo tablero
                name,
                description,
                userId: ownerId,
            };
            res.status(201).json(newBoard);
        }
    });
});

router.get('/', (req: Request, res: Response) => {
    // Consulta la base de datos para obtener todos los tableros
    db.all("SELECT * FROM boards", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener tableros de la base de datos' });
        } else {
            res.json(rows);
        }
    });
});

router.get('/:id', (req: Request, res: Response) => {
    const boardId = req.params.id;
    db.get<Board>("SELECT * FROM boards WHERE boardId = ?", boardId, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener el tablero de la base de datos' });
        } else if (row) {
            const board: Board = {
                boardId: row.boardId,
                name: row.name,
                description: row.description,
                userId: row.userId,
            };
            res.json(board);
        } else {
            res.status(404).json({ message: 'Tablero no encontrado' });
        }
    });
});

router.put('/:id', (req: Request, res: Response) => {
    const boardId = req.params.id;
    const { name, description, ownerId } = req.body;

    db.run("UPDATE boards SET name = ?, description = ?, userId = ? WHERE boardId = ?", [name, description, ownerId, boardId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar el tablero en la base de datos' });
        } else if (this.changes > 0) {
            const updatedBoard: Board = {
                boardId: Number(boardId),
                name,
                description,
                userId: ownerId,
            };
            res.json(updatedBoard);
        } else {
            res.status(404).json({ message: 'Tablero no encontrado' });
        }
    });
});

router.delete('/:id', (req: Request, res: Response) => {
    const boardId = req.params.id;

    db.run("DELETE FROM boards WHERE boardId = ?", boardId, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al eliminar el tablero de la base de datos' });
        } else if (this.changes > 0) {
            const deletedBoard: Board = {
                boardId: Number(boardId),
                name: '',
                description: '',
                userId: -1,
            };
            res.json(deletedBoard);
        } else {
            res.status(404).json({ message: 'Tablero no encontrado' });
        }
    });
});

export default router;
