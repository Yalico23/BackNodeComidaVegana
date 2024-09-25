import mongoose from 'mongoose';

const comidaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true, 
    },
    precio: {
        type: Number,
        trim: true,
        required: true, 
    },
    stock: {
        type: Number,
        trim: true,
        required: false //no es obligatoria
    },
    imagen: {
        type: String,
        trim: true,
        required: false //no es obligatoria
    },
})

const Comida = mongoose.model('Comida', comidaSchema);

export default Comida;