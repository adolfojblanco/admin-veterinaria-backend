import mongoose from 'mongoose';

const pacientesSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      require: true,
    },
    propietario: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    fecha: {
      type: Date,
      require: true,
    },
    sintomas: {
      type: String,
      require: true,
    },
    veterinario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Veterinario',
    },
  },
  {
    timestamps: true,
  }
);

export const Paciente = mongoose.model('Paciente', pacientesSchema);
