import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import routes from './routes/index.js';

const app = express();
app.use(express.json());
dotenv.config();
conectarDB();

/** Configuracion de cors */
const dominiosPermitidos = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callBack) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callBack(null, true);
    } else {
      callBack(new Error('No permitido por CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use('/api', routes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
