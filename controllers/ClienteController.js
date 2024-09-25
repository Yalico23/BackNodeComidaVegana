import Cliente from "../models/clientes.js";

const newClient = async (req, res, next) => {
  const cliente = new Cliente(req.body);
  try {
    await cliente.save();
    res.json({ mensaje: "Se agrego Correctamente" });
  } catch (error) {
    res.json(error);
    next(error);
  }
};

const getAllClient = async (req, res, next) => {
  try {
    const clientes = await Cliente.find({});
    res.json(clientes);
  } catch (error) {
    console.log(error);
    next();
  }
};

const getOneClient = async (req, res, next) => {
  try {
    const cliente = await Cliente.findById(req.params.idClient);
    if (!cliente) {
      res.json({ mensaje: "Ese Cliente no existe" });
      next();
    }
    res.json(cliente);
  } catch (error) {
    console.log(error);
    next();
  }
};

const updateClient = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      { _id: req.params.idClient },
      req.body,
      {
        new: true,
      }
    );
    if (!cliente) {
      return res.json({ mensaje: "Ese Cliente no existe" });  // Usar return para evitar continuar
    }
    res.json({ mensaje: "Se actualizo correctamente" });
  } catch (error) {
    res.json(error);
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const cliente = await Cliente.findOneAndDelete({
      _id: req.params.idClient,
    });
    if (!cliente) {
      res.json({ mensaje: "Ese Cliente no existe" });
      next();
    }
    res.json("El cliente fue eliminado");
  } catch (error) {
    console.log(error);
    next();
  }
};

export { getAllClient, newClient, getOneClient, updateClient, deleteClient };
