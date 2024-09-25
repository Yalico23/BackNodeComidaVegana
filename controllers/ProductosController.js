import Producto from "../models/productos.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { nanoid } from 'nanoid';
import sharp from "sharp";

// Obtener __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear carpeta de uploads si no existe
const uploadPath = path.join(__dirname, "../uploads/");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuración de Multer

const configuracionMulter = {
  storage: multer.memoryStorage(), // Almacena la imagen en memoria como un buffer
  fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato no válido"));
    }
  },
};
// Pasar la configuración y el campo
const upload = multer(configuracionMulter).single("imagen");

const subirArchivo = (req, res, next) => {
  upload(req, res, async function (error) {
    if (error) {
      return res.json({ mensaje: error.message });
    }

    if (req.file) {
      const newFilename = `cropped-${nanoid()}.${req.file.mimetype.split('/')[1]}`;
      const newFilepath = path.join(uploadPath, newFilename);
      console.log("Nuevo archivo procesado será guardado en:", newFilepath);

      try {
        // Procesa la imagen en memoria y guárdala directamente en el disco
        await sharp(req.file.buffer)
          .resize(360, 350, {
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy,
          })
          .toFile(newFilepath);

        console.log("Imagen procesada correctamente y guardada en:", newFilepath);

        // Actualiza la referencia del archivo en req.file
        req.file.filename = newFilename;
        console.log("Referencia del archivo en req.file.filename actualizada a:", req.file.filename);
      } catch (err) {
        console.log("Error al procesar la imagen:", err);
        return res.status(500).json({ mensaje: "Error al procesar la imagen" });
      }
    }
    next();
  });
};

const newProduct = async (req, res, next) => {
  const producto = new Producto(req.body);
  console.log("Nuevo producto creado con los siguientes datos:", req.body);

  try {
    if (req.file && req.file.filename) {
      producto.imagen = req.file.filename;
      console.log("Imagen asociada al producto:", producto.imagen);
    }
    await producto.save();
    console.log("Producto guardado correctamente:", producto);
    res.json({ mensaje: "Se agregó correctamente" });
  } catch (error) {
    console.log("Error al guardar el producto en la base de datos:", error);
    res.status(500).json({ mensaje: "Hubo un error al guardar el producto" });
  }
};
//mostrar productos
const getAllProducts = async (req, res, next) => {
  try {
    const productos = await Producto.find({});
    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al obtener los productos" });
    next();
  }
};

//mostrar un producto
const getOneProduct = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.idProducto);
    if (!producto) {
      res.status(404).json({ mensaje: "Ese Producto no existe" });
      return next();
    }
    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al obtener el producto" });
    next(error);
  }
};

//actualizar producto

const updateProduct = async (req, res, next) => {
  const nuevoProducto = req.body;
  try {
    const productoAnterior = await Producto.findById(req.params.idProducto);

    if (!productoAnterior) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    if (req.file) {
      nuevoProducto.imagen = req.file.filename;
      const imagenAnteriorPath = path.join(
        __dirname,
        "../uploads",
        productoAnterior.imagen
      );
      console.log(imagenAnteriorPath);
      // Eliminar la imagen anterior
      fs.unlink(imagenAnteriorPath, (error) => {
        if (error) {
          console.log("Error eliminando la imagen anterior:", error);
        }
      });
    } else {
      nuevoProducto.imagen = productoAnterior.imagen;
    }
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.idProducto,
      nuevoProducto,
      { new: true }
    );
    res.json({
      mensaje: "Se ha actualizado la información del producto",
      producto: productoActualizado,
    });
  } catch (error) {
    console.log("Error actualizando el producto:", error);
    res.status(500).json({ mensaje: "Error actualizando el producto" });
    next(error);
  }
};

//Eliminar Producto

const deleteProduct = async (req, res, next) => {
  try {
    const producto = await Producto.findOneAndDelete({ _id:req.params.idProducto});

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    if (producto.imagen) {
      const imagenAnteriorPath = path.join(
        __dirname,
        "../uploads",
        producto.imagen
      );

      // Eliminar archivo con filesystem
      fs.unlink(imagenAnteriorPath, (error) => {
        if (error) {
          console.log("Error eliminando la imagen:", error);
        }
      });
    }

    res.json({ mensaje: "Producto Eliminado", producto });
  } catch (error) {
    console.log("Error eliminando el producto:", error);
    res.status(500).json({ mensaje: "Error eliminando el producto" });
    next(error);
  }
};

export {
  newProduct,
  subirArchivo,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
