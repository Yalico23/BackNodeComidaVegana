import mongoose from 'mongoose';

// Definición del esquema
const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    required: true, // Considera agregar `required` si el campo es obligatorio
  },
  apellido: {
    type: String,
    trim: true,
    required: true, // Considera agregar `required` si el campo es obligatorio
  },
  empresa: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true, // Considera agregar `required` si el campo es obligatorio
  },
  telefono: {
    type: String,
    trim: true,
  },
});

// Exporta el modelo
const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;
