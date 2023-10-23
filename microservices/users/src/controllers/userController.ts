import express, { Request, Response } from 'express';
import { User } from '../models/userModel';
import sqlite3 from 'sqlite3';

const router = express.Router();
const db = new sqlite3.Database('users.db');

// Crea una tabla para los usuarios si no existe
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, password TEXT, rol TEXT)");
});

router.get('/', (req: Request, res: Response) => {
  // Consulta la base de datos para obtener todos los usuarios
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener usuarios de la base de datos' });
    } else {
      res.json(rows);
    }
  });
});

router.post('/', (req: Request, res: Response) => {
  const newUser: User = req.body;
  db.run("INSERT INTO users (name, email, password, rol) VALUES (?, ?, ?, ?)", [newUser.name, newUser.email, newUser.password, newUser.rol], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al insertar usuario en la base de datos' });
    } else {
      newUser.id = this.lastID; // Obtén el ID generado para el nuevo usuario
      res.json(newUser);
    }
  });
});

router.put('/:id', (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const updatedUser: User = req.body;
  db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [updatedUser.name, updatedUser.email, userId], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar usuario en la base de datos' });
    } else {
      if (this.changes > 0) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    }
  });
});

router.delete('/:id', (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  db.run("DELETE FROM users WHERE id = ?", userId, function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar usuario de la base de datos' });
    } else {
      if (this.changes > 0) {
        res.json({ id: userId });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    }
  });
});

export default router;
