import mongoose from "mongoose";

const usuarioSchema = new  mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true 
    },
    nombre : {
        type:String,
        required: 'Agrega tu nombre'
    },
    password:{
        type: String,
        required: true
    }
})

const  Usuario  = mongoose.model('Usuario', usuarioSchema)

export default Usuario;