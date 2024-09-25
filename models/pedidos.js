import mongoose, { Schema } from "mongoose";

const pedidoeSchema = new mongoose.Schema({
  cliente: {
    client: {
      type: Schema.ObjectId,
      ref: "Cliente",
    },
    _id: {
      type: String,
    },
    nombre: {
      type: String,
    },
    apellido: {
      type: String,
    },
  },

  pedidos: [
    {
      producto: {
        type: Schema.ObjectId,
        ref: "Producto",
      },
      nombre: {
        type: String,
      },
      cantidad: {
        type: Number,
      },
      precio: {
        type: Number,
      },
    },
  ],
  total: {
    type: Number,
  },
});

// Middleware para copiar datos del cliente y producto al crear o actualizar un pedido
pedidoeSchema.pre("save", async function (next) {
  // Copiar datos del cliente
  if (this.isNew || this.isModified('cliente')) {
    const cliente = await mongoose.model("Cliente").findById(this.cliente.client);
    if (cliente) {
      this.cliente._id = cliente._id.toString();
      this.cliente.nombre = cliente.nombre;
      this.cliente.apellido = cliente.apellido;
    } else {
      return next(new Error(`Cliente con ID ${this.cliente.client} no encontrado`));
    }
  }

  // Copiar datos del producto para cada pedido
  for (let i = 0; i < this.pedidos.length; i++) {
    const pedido = this.pedidos[i];
    if (!pedido.precio || !pedido.nombre) {
      const producto = await mongoose.model("Producto").findById(pedido.producto);
      if (producto) {
        pedido.nombre = producto.nombre;  // Copia el nombre del producto
        pedido.precio = producto.precio;  // Copia el precio del producto
      } else {
        return next(new Error(`Producto con ID ${pedido.producto} no encontrado`));
      }
    }
  }

  // Recalcula el total basado en los precios guardados
  this.total = this.pedidos.reduce(
    (acc, curr) => acc + curr.cantidad * curr.precio,
    0
  );

  next();
});

const Pedido = mongoose.model("Pedido", pedidoeSchema);

export default Pedido;
