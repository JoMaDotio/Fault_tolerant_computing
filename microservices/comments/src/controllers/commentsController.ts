import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { CardComment } from '../models/commentsModel';

const router = express.Router();
const db = new sqlite3.Database('comments.db');

// Crea una tabla para los comentarios si no existe
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS comments (commentId INTEGER PRIMARY KEY, content TEXT, cardId INTEGER, userId INTEGER, createdAt TEXT)");
});

// Crear un nuevo comentario en la base de datos
router.post('/', (req: Request, res: Response) => {
    const { content, cardId, userId } = req.body;
    const createdAt = new Date().toUTCString();

    db.run("INSERT INTO comments (content, cardId, userId, createdAt) VALUES (?, ?, ?, ?)", [content, cardId, userId, createdAt], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al insertar el comentario en la base de datos' });
        } else {
            const newComment = {
                commentId: this.lastID, // ID generado para el nuevo comentario
                content,
                cardId,
                userId,
                createdAt,
            };
            res.status(201).json(newComment);
        }
    });
});

// Obtener todos los comentarios
router.get('/', (req: Request, res: Response) => {
    db.all("SELECT * FROM comments", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener los comentarios de la base de datos' });
        } else {
            res.json(rows);
        }
    });
});

// Obtener un comentario por su ID
router.get('/:id', (req: Request, res: Response) => {
    const commentId = req.params.id;
    db.get<CardComment>("SELECT * FROM comments WHERE commentId = ?", commentId, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener el comentario de la base de datos' });
        } else if (row) {
            const comment = {
                commentId: row.commentId,
                content: row.content,
                cardId: row.cardId,
                userId: row.userId,
                createdAt: row.createdAt,
            };
            res.json(comment);
        } else {
            res.status(404).json({ message: 'Comentario no encontrado' });
        }
    });
});

// Actualizar un comentario por su ID
router.put('/:id', (req: Request, res: Response) => {
    const commentId = req.params.id;
    const { content, cardId, userId, createdAt } = req.body;

    db.run("UPDATE comments SET content = ?, cardId = ?, userId = ?, createdAt = ? WHERE commentId = ?", [content, cardId, userId, createdAt, commentId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar el comentario en la base de datos' });
        } else if (this.changes > 0) {
            const updatedComment = {
                commentId: Number(commentId),
                content,
                cardId,
                userId,
                createdAt,
            };
            res.json(updatedComment);
        } else {
            res.status(404).json({ message: 'Comentario no encontrado' });
        }
    });
});

// Eliminar un comentario por su ID
router.delete('/:id', (req: Request, res: Response) => {
    const commentId = req.params.id;

    db.run("DELETE FROM comments WHERE commentId = ?", commentId, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al eliminar el comentario de la base de datos' });
        } else if (this.changes > 0) {
            const deletedComment = {
                commentId: Number(commentId),
                content: '',
                cardId: -1,
                userId: -1,
                createdAt: '',
            };
            res.json(deletedComment);
        } else {
            res.status(404).json({ message: 'Comentario no encontrado' });
        }
    });
});

export default router;
