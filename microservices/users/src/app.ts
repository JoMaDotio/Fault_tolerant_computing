// app.ts
import express from 'express';
import bodyParser from 'body-parser';
import userController from './controllers/userController';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/users', userController);

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
