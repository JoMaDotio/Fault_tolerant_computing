import express from 'express';
import bodyParser from 'body-parser';
import boardController from './controllers/boardController';

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Agrega las rutas para el modelo de tableros
app.use('/boards', boardController);

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
