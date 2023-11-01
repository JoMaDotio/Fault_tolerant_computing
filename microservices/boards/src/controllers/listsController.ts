import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { BoardList } from '../models/listModel';

const router = express.Router();
const db = new sqlite3.Database('boards.db');

// Crea una tabla para las listas si no existe
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS lists (listId INTEGER PRIMARY KEY, name TEXT, boardId INTEGER)");
});

// Crear una nueva lista en la base de datos
router.post('/', (req: Request, res: Response) => {
  const { name, boardId } = req.body;

  db.run("INSERT INTO lists (name, boardId) VALUES (?, ?)", [name, boardId], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al insertar la lista en la base de datos' });
    } else {
      const newList: BoardList = {
        listId: this.lastID, // ID generado para la nueva lista
        name,
        boardId,
      };
      res.status(201).json(newList);
    }
  });
});

// Obtener todas las listas
router.get('/', (req: Request, res: Response) => {
  db.all("SELECT * FROM lists", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener las listas de la base de datos' });
    } else {
      res.json(rows);
    }
  });
});

// Obtener una lista por su ID
router.get('/:id', (req: Request, res: Response) => {
  const listId = req.params.id;
  db.get<BoardList>("SELECT * FROM lists WHERE listId = ?", listId, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener la lista de la base de datos' });
    } else if (row) {
      const list = {
        listId: row.listId,
        name: row.name,
        boardId: row.boardId,
      };
      res.json(list);
    } else {
      res.status(404).json({ message: 'Lista no encontrada' });
    }
  });
});

// Actualizar una lista por su ID
router.put('/:id', (req: Request, res: Response) => {
  const listId = req.params.id;
  const { name, boardId } = req.body;

  db.run("UPDATE lists SET name = ? WHERE listId = ?", [name, boardId], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar la lista en la base de datos' });
    } else if (this.changes > 0) {
      const updatedList: BoardList = {
        listId: Number(listId),
        name,
        boardId,
      };
      res.json(updatedList);
    } else {
      res.status(404).json({ message: 'Lista no encontrada' });
    }
  });
});

// Eliminar una lista por su ID
router.delete('/:id', (req: Request, res: Response) => {
  const listId = req.params.id;

  db.run("DELETE FROM lists WHERE listId = ?", listId, function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar la lista de la base de datos' });
    } else if (this.changes > 0) {
      const deletedList: BoardList = {
        listId: Number(listId),
        name: '',
        boardId: "-1",
      };
      res.json(deletedList);
    } else {
      res.status(404).json({ message: 'Lista no encontrada' });
    }
  });
});

export default router;
