export const guess = (req, res) => {
    const adivinanza = req.body.adivinanza.toLowerCase();
    
    if (adivinanza === palabraSecreta) {
      res.send('¡Correcto! Has adivinado la palabra.');
    } else {
      res.send('Incorrecto. Intenta de nuevo.');
    }
}