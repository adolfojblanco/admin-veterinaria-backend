import express from 'express';
const router = express.Router();

import { checkAuth } from '../middlewares/authMiddleware.js';

import {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from '../controllers/pacienteController.js';

/**
 * Rutas de paciente
 */

router.post('/', checkAuth, agregarPaciente);
router.get('/', checkAuth, obtenerPacientes);
router.get('/:id', checkAuth, obtenerPaciente);
router.put('/:id', checkAuth, actualizarPaciente);
router.delete('/:id', checkAuth, eliminarPaciente);

export default router;
