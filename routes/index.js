import express from 'express';
const app = express();

import veterinarioRoutes from './veterinarioRoutes.js';
import pacienteRoutes from './pacienteRoutes.js';

// Rutas del app

app.use('/veterinarios', veterinarioRoutes);
app.use('/pacientes', pacienteRoutes);

export default app;
