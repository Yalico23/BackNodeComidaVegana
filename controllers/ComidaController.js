import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { nanoid } from 'nanoid';
import sharp from "sharp";
import Comida from "../models/comida.js";

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

const newFood = async (req, res, next) => {
    const comida = new Comida(req.body);
    console.log("Nuevo comida creado con los siguientes datos:", req.body);
  
    try {
      if (req.file && req.file.filename) {
        comida.imagen = req.file.filename;
        console.log("Imagen asociada al comida:", comida.imagen);
      }
      await comida.save();
      console.log("comida guardado correctamente:", comida);
      res.json({ mensaje: "Se agregó correctamente" });
    } catch (error) {
      console.log("Error al guardar el comida en la base de datos:", error);
      res.status(500).json({ mensaje: "Hubo un error al guardar el comida" });
    }
  };

  const getAllProducts = async (req, res, next) => {
    try {
      const comida = await Comida.find({});
      res.json(comida);
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error al obtener los comida" });
      next();
    }
  };

  export {
    subirArchivo,
    newFood,
    getAllProducts
  }