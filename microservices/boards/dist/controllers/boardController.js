"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const router = express_1.default.Router();
const db = new sqlite3_1.default.Database('boards.db');
// Crea una tabla para los tableros si no existe
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS boards (boardId INTEGER PRIMARY KEY, name TEXT, description TEXT, userId INTEGER)");
});
router.post('/', (req, res) => {
    const { name, description, ownerId } = req.body;
    db.run("INSERT INTO boards (name, description, userId) VALUES (?, ?, ?)", [name, description, ownerId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al insertar el tablero en la base de datos' });
        }
        else {
            const newBoard = {
                boardId: this.lastID,
                name,
                description,
                userId: ownerId,
            };
            res.status(201).json(newBoard);
        }
    });
});
router.get('/', (req, res) => {
    // Consulta la base de datos para obtener todos los tableros
    db.all("SELECT * FROM boards", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener tableros de la base de datos' });
        }
        else {
            res.json(rows);
        }
    });
});
router.get('/:id', (req, res) => {
    const boardId = req.params.id;
    db.get("SELECT * FROM boards WHERE boardId = ?", boardId, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener el tablero de la base de datos' });
        }
        else if (row) {
            const board = {
                boardId: row.boardId,
                name: row.name,
                description: row.description,
                userId: row.userId,
            };
            res.json(board);
        }
        else {
            res.status(404).json({ message: 'Tablero no encontrado' });
        }
    });
});
router.put('/:id', (req, res) => {
    const boardId = req.params.id;
    const { name, description, ownerId } = req.body;
    db.run("UPDATE boards SET name = ?, description = ?, userId = ? WHERE boardId = ?", [name, description, ownerId, boardId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar el tablero en la base de datos' });
        }
        else if (this.changes > 0) {
            const updatedBoard = {
                boardId: Number(boardId),
                name,
                description,
                userId: ownerId,
            };
            res.json(updatedBoard);
        }
        else {
            res.status(404).json({ message: 'Tablero no encontrado' });
        }
    });
});
router.delete('/:id', (req, res) => {
    const boardId = req.params.id;
    db.run("DELETE FROM boards WHERE boardId = ?", boardId, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al eliminar el tablero de la base de datos' });
        }
        else if (this.changes > 0) {
            const deletedBoard = {
                boardId: Number(boardId),
                name: '',
                description: '',
                userId: -1,
            };
            res.json(deletedBoard);
        }
        else {
            res.status(404).json({ message: 'Tablero no encontrado' });
        }
    });
});
exports.default = router;
