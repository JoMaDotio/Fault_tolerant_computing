import express from 'express';
import path from 'path'
import * as fs from 'fs'
import { levenshteinEditDistance } from 'levenshtein-edit-distance';

const app = express();
const port = 3000;
const __dirname = path.resolve();

// Ruta del archivo donde se almacenarán los datos
const dataFilePath = path.join(__dirname, 'backup.json');

// Función para guardar los datos en el archivo
function guardarDatos(palabraSecreta, intentos, adivinanzasIncorrectas) {
    const datos = {
        palabraSecreta,
        intentos,
        adivinanzasIncorrectas,
    };

    fs.writeFileSync(dataFilePath, JSON.stringify(datos, null, 2));
}

// Función para leer los datos desde el archivo
function leerDatos() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

const datosGuardados = leerDatos();
let palabraSecreta = 'gato'; // Valor predeterminado si no hay datos guardados
let intentos = 0;
const adivinanzasIncorrectas = [];

if (datosGuardados) {
    palabraSecreta = datosGuardados.palabraSecreta || palabraSecreta;
    intentos = datosGuardados.intentos || intentos;
    adivinanzasIncorrectas.push(...(datosGuardados.adivinanzasIncorrectas || []));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname ,'/index.html'));
});

app.get('/obtener-informacion-inicial', (req, res) => {
    res.json({
      intentos,
      adivinanzasIncorrectas,
    });
});

app.post('/adivinar', (req, res) => {
    const { adivinanza } = req.body;
    const adivinanzaLowerCase = adivinanza.toLowerCase();

    // Calcula la distancia de Levenshtein entre la adivinanza y la palabra secreta
    const distancia = levenshteinEditDistance(adivinanzaLowerCase, palabraSecreta);

    // Incrementa el contador de intentos
    intentos++;

    // Calcula el puntaje en función de la distancia
    const puntaje = 100 - distancia;

    if (puntaje == 100) {
        // Reinicia el contador de intentos y el array de adivinanzas incorrectas
        intentos = 0;
        adivinanzasIncorrectas.length = 0;
        
        return res.json({
        resultado: 'correcto',
        puntaje,
        intentos,
        });
    } 
    
    return res.json({
    resultado: 'incorrecto',
    puntaje,
    intentos,
    adivinanzasIncorrectas,
    });
});

app.post('/reiniciar', (req, res) => {
    palabraSecreta = 'gato'; // Restablecer la palabra secreta
    intentos = 0; // Restablecer los intentos
    adivinanzasIncorrectas.length = 0; // Limpiar la lista de adivinanzas incorrectas
    guardarDatos(palabraSecreta, intentos, adivinanzasIncorrectas);
    res.json({ reiniciado: true });
});

app.get('/detener-servidor', (req, res) => {
    console.log('El servidor se ha detenido manualmente.');
    res.json({ detenido: true });
    setTimeout(() => {
      process.exit(0); // Detener el servidor de manera segura
    }, 1000); // Puedes ajustar el tiempo de espera según tus necesidades
});

process.on('exit', () => {
    guardarDatos(palabraSecreta, intentos, adivinanzasIncorrectas);
});

app.listen(port, () => {
    console.log(`Servidor en http://127.0.0.1:${port}`);
});