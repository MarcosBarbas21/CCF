const express = require('express');
const cors = require('cors');

const routerApi = require('./routes');//el archivo index.js se busca en automático
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const app = express();
const port = 3000;

app.use(express.json());//este es un Middleware

const whitelist = ["http://127.0.0.1:5500", 'http://localhost:8080','http://localhost:8005', 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback( null, true);
    } else {
      callback(new Error('No tiene permiso para acceder'));
    }
  }
}
app.use(cors(options));

app.get('/', (req, res) => {
  res.send('Hola, este es mi primer servidor!')
});


routerApi(app); // Este es el index.js de routing con express como atributo


app.use(logErrors);//Es muy importante poner este primero xq lleva el next
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Estamos escuchando en el puerto http://localhost:${port}`)
})
