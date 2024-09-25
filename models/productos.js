import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
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
    imagen: {
        type: String,
        trim: true,
        required: false //no es obligatoria
    },

})

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;