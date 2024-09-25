import Pedido from "../models/pedidos.js";

const nuevoPedido = async (req, res, next) => {
  const pedido = new Pedido(req.body);
  try {
    await pedido.save();
    res.json({ mensaje: "Se agrego un nuevo pedido" });
  } catch (error) {
    console.log("Error agregando el pedido:", error);
    res.status(500).json({ mensaje: "Error agregando el producto" });
    next(error);
  }
};

const mostrarPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find({})
    .populate({
      path: 'cliente.client',
      model: 'Cliente'
    })
    .populate({
        path: 'pedidos.producto',
        model: 'Producto'
    })
    res.json(pedidos)
  } catch (error) {
    console.log("Error al mostrar los pedidos:", error);
    res.status(500).json({ mensaje: "Error al mostrar los pedidos" });
    next(error);
  }
};
//Muestra un pedido
const mostarPedidoId = async (req, res, next) => {
  try {
    const pedido = await Pedido.findById(req.params.idPedido).populate('cliente').populate({
      path: 'pedidos.producto',
      model: 'Producto'
    });
    if (!pedido) {
      res.json({ mensaje: "Ese Pedido no existe" });
      return; // Detener la ejecución de la función
    }
    res.json(pedido);
  } catch (error) {
    console.log("Error al mostrar el pedido:", error);
    if (!res.headersSent) {
      res.status(500).json({ mensaje: "Error al mostrar el pedido" });
    }
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

//Actualizar pedido
const actualizarPedido = async (req, res, next) => {
  try {
    // Actualización del pedido
    const pedido = await Pedido.findOneAndUpdate(
      { _id: req.params.idPedido },
      req.body,
      { new: true, runValidators: true }
    );

    // Si el pedido no se encuentra, devolver un error 404
    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    // Devolver el pedido actualizado
    res.json(pedido);
  } catch (error) {
    // Manejo de errores
    console.error("Error al actualizar el pedido:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ mensaje: "Error al actualizar el pedido", detalle: error.message });
    }
    // Pasar el error al middleware de manejo de errores
    next(error);
  }
};

const eliminarPedido = async (req, res, next) => {
  try {
    const pedido = await Pedido.findOneAndDelete({ _id: req.params.idPedido });
    
    if (!pedido) {
      return res.status(404).json({ mensaje: "Ese pedido no existe" });
    }
    
    res.json({ mensaje: "El pedido fue eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Hubo un error al eliminar el pedido" });
    next(error);  // Si tienes un middleware de manejo de errores, puedes pasar el error a 'next'
  }
};


export { nuevoPedido, mostrarPedidos , mostarPedidoId , actualizarPedido, eliminarPedido};
