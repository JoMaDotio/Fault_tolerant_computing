// userController.ts
import express, { Request, Response } from 'express';
import { User } from '../models/userModel';

const router = express.Router();

const users: User[] = [];

router.get('/', (req: Request, res: Response) => {
  res.json(users);
});

router.post('/', (req: Request, res: Response) => {
  const newUser: User = req.body;
  console.log(req.body)
  users.push(newUser);
  res.json(newUser);
});

router.put('/:id', (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const updatedUser: User = req.body;
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1)[0];
    res.json(deletedUser);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

export default router;
