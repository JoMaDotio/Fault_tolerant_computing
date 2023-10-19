"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const boardController_1 = __importDefault(require("./controllers/boardController"));
const app = (0, express_1.default)();
const port = 3001;
app.use(body_parser_1.default.json());
// Agrega las rutas para el modelo de tableros
app.use('/boards', boardController_1.default);
app.listen(port, () => {
    console.log(`El servidor está escuchando en el puerto ${port}`);
});
