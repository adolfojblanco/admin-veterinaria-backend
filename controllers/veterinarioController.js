import { Veterinario } from '../models/Veterinario.js';
import { generarJWT } from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';
import { emailRegistro } from '../helpers/emailRegistro.js';
import { emailOlvidePassword } from '../helpers/emailOlvidePassword.js';

/**
 * Registro de un veterinario
 */
export const registrar = async (req, res) => {
  const { email, nombre } = req.body;

  const existeUsuario = await Veterinario.findOne({ email });
  if (existeUsuario) {
    const error = new Error('¡Ups! Usuario ya existe');
    return res.status(400).json({
      msg: error.message,
    });
  }

  try {
    const veterinario = await new Veterinario(req.body);
    await veterinario.save();

    // Envio de email de confirmacion
    emailRegistro({
      email,
      nombre,
      token: veterinario.token,
    });

    res.status(200).json({
      msg: 'Registrado correctamente',
      veterinario,
    });
  } catch (error) {
    return res.status(404).json({
      msg: 'No se puede registrar al usuario',
      error: error.message,
    });
  }
};

/**
 * Confirmando cuenta usuario
 */
export const confirmar = async (req, res) => {
  const { token } = req.params;
  const veterinario = await Veterinario.findOne({ token });

  if (!veterinario) {
    const error = new Error('¡Ups! Token no valido');
    return res.status(404).json({
      msg: error.message,
    });
  }

  try {
    veterinario.token = null;
    veterinario.confirmado = true;
    await veterinario.save();

    res.send({ msg: 'Cuenta confirmada' });
  } catch (error) {
    console.log(error);
  }
};

export const autenticar = async (req, res) => {
  const { email, password } = req.body;
  const veterinario = await Veterinario.findOne({ email });

  // Comprobar si eexiste el email
  if (!veterinario) {
    const error = new Error('¡Ups! El usuario no existe');
    return res.status(400).json({
      msg: error.message,
    });
  }

  // Comprobar si el usuario esta confirmado
  if (!veterinario.confirmado) {
    const error = new Error('¡Ups! Debes confirmar tu cuenta');
    return res.status(403).json({
      msg: error.message,
      error: error.message,
    });
  }

  // Comprobar el password
  if (await veterinario.comprobarPassword(password)) {
    // Autenticamos al usuario

    res.status(200).json({
      _id: veterinario._id,
      nombre: veterinario.nombre,
      email: veterinario.email,
      token: generarJWT(veterinario.id),
    });
  } else {
    const error = new Error('¡Ups! Usuario no existe');
    return res.status(403).json({
      msg: 'El usuario no existe',
      error: error.message,
    });
  }
};

export const perfil = async (req, res) => {
  const { veterinario } = req;

  res.status(200).json(veterinario);
};

/**
 * Inicio del proceso para restablecer contraseña
 * @param {email} req Solicitamos un email para generar el token
 * @param {token} res Enviamos un email para restablecer la contraseña
 * @returns token
 */
export const olvidePassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const veterinario = await Veterinario.findOne({ email });
  if (!veterinario) {
    const error = new Error('¡Ups! EL usuario no existe');
    return res.status(404).json({
      msg: error.message,
    });
  }

  try {
    veterinario.token = generarId();
    await veterinario.save();

    // Envio de email
    emailOlvidePassword({
      email,
      nombre: veterinario.nombre,
      token: veterinario.token,
    });

    res.status(200).json({
      msg: 'Hemos enviado un enlace con las instrucciones',
    });
  } catch (error) {}
};

/**
 * Comprueba el token enviado
 * @param {token} req Recibimos el token enviado para restablecer la cuenta
 */
export const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const veterinario = Veterinario.findOne({ token });

  if (veterinario) {
    res.status(200).json({
      msg: 'Token valido',
    });
  } else {
    const error = new Error('¡Ups! Token no valido');
    return res.status(400).json({
      msg: error.message,
    });
  }
};

/**
 * Cambio de contraseña
 * @param {token} req solicita el token enviado para cambiar la contraseña
 * @param {usuario} res devolvemos el usuario con la nueva contraseña
 */
export const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });

  if (!veterinario) {
    const error = new Error('¡Ups! Token no valido');
    return res.status(400).json({
      msg: error.message,
    });
  }

  try {
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    res.status(200).json({
      msg: 'Contraseña actualizada correctamente',
    });
  } catch (error) {}
};
