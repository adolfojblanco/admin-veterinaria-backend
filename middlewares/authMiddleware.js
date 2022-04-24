import jwt from 'jsonwebtoken';
import { Veterinario } from '../models/Veterinario.js';

export const checkAuth = async (req, res, next) => {
  let token;
  if (
    // Comprobamos que venga el token
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtenemos el token
      token = req.headers.authorization.split(' ')[1];
      // Comprobamos el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lo agragamos al request
      req.veterinario = await Veterinario.findById(
        decoded.id
      ).select('-password -token -confirmado');
    } catch (error) {
      return res.status(403).json({
        msg: 'Token no valido',
        error: error.message
      });
    }
  } else {
    const error = new Error('¡Ups! Token no valido');
    return res.status(403).json({
      msg: error.message,
    });
  }

  // Si no se asigna la variable, enviamos el error y continuamos
  if (!token) {
    const error = new Error('¡Ups! Token no valido');
    return res.status(403).json({
      msg: error.message,
    });
  }

  next();
};
