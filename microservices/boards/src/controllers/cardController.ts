import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { BoardCard } from '../models/cardModel';

const router = express.Router();
const db = new sqlite3.Database('boards.db'); // Suponemos que tienes una base de datos SQLite llamada 'boards.db'

// Crea una tabla para las tarjetas si no existe
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS cards (cardId INTEGER PRIMARY KEY, title TEXT, description TEXT, listId INTEGER, createdAt TEXT, dueDate TEXT)");
});

// Crea una nueva tarjeta en la base de datos
router.post('/', (req: Request, res: Response) => {
    const { title, description, listId, dueDate } = req.body;
    const createdAt = new Date().toUTCString();

    db.run("INSERT INTO cards (title, description, listId, createdAt, dueDate) VALUES (?, ?, ?, ?, ?)", [title, description, listId, createdAt, dueDate], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al insertar la tarjeta en la base de datos' });
        } else {
            const newCard = {
                cardId: this.lastID, // ID generado para la nueva tarjeta
                title,
                description,
                listId,
                createdAt,
                dueDate,
            };
            res.status(201).json(newCard);
        }
    });
});

// Obtener todas las tarjetas
router.get('/', (req: Request, res: Response) => {
    db.all<BoardCard>("SELECT * FROM cards", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener las tarjetas de la base de datos' });
        } else {
            res.json(rows);
        }
    });
});

// Obtener una tarjeta por su ID
router.get('/:id', (req: Request, res: Response) => {
    const cardId = req.params.id;
    db.get<BoardCard>("SELECT * FROM cards WHERE cardId = ?", cardId, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener la tarjeta de la base de datos' });
        } else if (row) {
            const card = {
                cardId: row.cardId,
                title: row.title,
                description: row.description,
                listId: row.listId,
                createdAt: row.createdAt,
                dueDate: row.dueDate,
            };
            res.json(card);
        } else {
            res.status(404).json({ message: 'Tarjeta no encontrada' });
        }
    });
});

// Actualizar una tarjeta por su ID
router.put('/:id', (req: Request, res: Response) => {
    const cardId = req.params.id;
    const { title, description, listId, dueDate, createdAt} = req.body;

    db.run("UPDATE cards SET title = ?, description = ?, listId = ?, dueDate = ? WHERE cardId = ?", [title, description, listId, dueDate, cardId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar la tarjeta en la base de datos' });
        } else if (this.changes > 0) {
            const updatedCard: BoardCard = {
                cardId: Number(cardId),
                title,
                description,
                listId,
                dueDate,
                createdAt
            };
            res.json(updatedCard);
        } else {
            res.status(404).json({ message: 'Tarjeta no encontrada' });
        }
    });
});

// Eliminar una tarjeta por su ID
router.delete('/:id', (req: Request, res: Response) => {
    const cardId = req.params.id;

    db.run("DELETE FROM cards WHERE cardId = ?", cardId, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al eliminar la tarjeta de la base de datos' });
        } else if (this.changes > 0) {
            const deletedCard = {
                cardId: Number(cardId),
                title: '',
                description: '',
                listId: -1,
                createdAt: '',
                dueDate: '',
            };
            res.json(deletedCard);
        } else {
            res.status(404).json({ message: 'Tarjeta no encontrada' });
        }
    });
});

export default router;
