import { Paciente } from '../models/Paciente.js';

export const agregarPaciente = async (req, res) => {
  try {
    const paciente = await new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    await paciente.save();

    res.status(200).json({
      msg: 'Registrado correctamente',
      paciente,
    });
  } catch (error) {}
};

export const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find()
      .where('veterinario')
      .equals(req.veterinario);

    res.status(200).json({
      pacientes,
    });
  } catch (error) {}
};

/**
 * Obtener un unico paciente
 * @param { id } req Obtiene un pacient por el id
 * @param { paciente } res devuelve un paciente
 */
export const obtenerPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findById(id);

    // Si no existe el paciente
    if (!paciente) {
      res.status(404).json({ msg: 'No encontrado' });
    }

    if (paciente.veterinario._id.toString() !== req.veterinario.id.toString()) {
      return res.status(403).json({
        msg: 'No autorizado',
      });
    }
    res.status(200).json({
      paciente,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

/**
 * Modificar paciente
 * @returns paciente
 */
export const actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  const paciente = await Paciente.findById(id);

  // Si no existe el paciente
  if (!paciente) {
    res.status(404).json({ msg: 'No encontrado' });
  }

  // comprobamos que el que lo solicita sea el que lo creo
  if (paciente.veterinario._id.toString() !== req.veterinario.id.toString()) {
    return res.status(403).json({
      msg: 'No autorizado',
    });
  }

  // Actualizar paciente
  paciente.nombre = req.body.nombre || paciente.nombre;
  paciente.propietario = req.body.propietario || paciente.propietario;
  paciente.email = req.body.email || paciente.email;
  paciente.fecha = req.body.fecha || paciente.fecha;
  paciente.sintomas = req.body.sintomas || paciente.sintomas;

  try {
    const pacienteActualizado = await paciente.save();
    res.status(200).json({ pacienteActualizado });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/**
 * Elimina un paciente
 * @param {id, veterinario} req id del paciente a eliminar, veterinario propietario
 * @returns
 */
export const eliminarPaciente = async (req, res) => {
  const { id } = req.params;
  const paciente = await Paciente.findById(id);

  // Si no existe el paciente
  if (!paciente) {
    res.status(404).json({ msg: 'No encontrado' });
  }

  // comprobamos que el que lo solicita sea el que lo creo
  if (paciente.veterinario._id.toString() !== req.veterinario.id.toString()) {
    return res.status(403).json({
      msg: 'No autorizado',
    });
  }

  try {
    await paciente.deleteOne();
    res.status(200).json({ msg: 'Paciente eliminado' });
  } catch (error) {
    res.status(404).json({ msg: 'No se pudo eliminar' });
  }
};
