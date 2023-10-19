"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// userController.ts
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const users = [];
router.get('/', (req, res) => {
    res.json(users);
});
router.post('/', (req, res) => {
    const newUser = req.body;
    console.log(req.body);
    users.push(newUser);
    res.json(newUser);
});
router.put('/:id', (req, res) => {
    const userId = Number(req.params.id);
    const updatedUser = req.body;
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = Object.assign(Object.assign({}, users[userIndex]), updatedUser);
        res.json(users[userIndex]);
    }
    else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});
router.delete('/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1)[0];
        res.json(deletedUser);
    }
    else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});
exports.default = router;
