import multer from 'multer'

export const msg = ''
let nombre = ''

// Definimos el almacenamientyo
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req, file, cb) => {
    nombre = Date.now() + '-' + file.originalname.trim().replace(/\s+/g, '').toLowerCase()
    cb(null, nombre)
  }
})

// Manejo del archivo
export const subirArchivos = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Solo se permiten archivos de imagen'))
    }
    cb(null, true)
  }
})
