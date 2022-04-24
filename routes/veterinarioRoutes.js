import express from 'express';
const router = express.Router();

import { checkAuth } from '../middlewares/authMiddleware.js';
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
} from '../controllers/veterinarioController.js';

/**
 * Rutas de Veterinarios
 */

/** Area publica */
router.post('/login', autenticar);
router.post('/registrar', registrar);
router.get('/confirmar/:token', confirmar);

/** Recuperar contraseña */
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

/** Area privada */
router.get('/perfil', checkAuth, perfil);

export default router;
