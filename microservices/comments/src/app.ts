import express from 'express';
import bodyParser from 'body-parser';
import commentController from './controllers/commentsController';

const app = express();
const port = 3002; // Puerto en el que se ejecutará el microservicio

app.use(bodyParser.json());

// Agrega las rutas para la entidad de Comentarios
app.use('/comments', commentController);

app.listen(port, () => {
  console.log(`El servidor de comentarios está escuchando en el puerto ${port}`);
});
