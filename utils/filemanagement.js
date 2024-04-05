import path from 'node:path'
import fs from 'node:fs'
import { pool } from '../config/db.js'
export const basePath = process.cwd()

// Funcion para eliminar el archivo
export function eliminarArchivo (nombre) {
  const archivo = basePath + '/public/uploads/' + nombre
  const aEliminar = path.resolve(archivo)
  fs.access(archivo, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlinkSync(aEliminar)
    }
  })
}

// Validate picture
export async function reemplazarFoto (picture, id, elemento) {
  if (elemento === 'usuario') {
    const [pic] = await pool.query('SELECT imagen_perfil FROM usuarios WHERE id = ?', [id])
    if (picture !== pic[0].imagen_perfil) {
      eliminarArchivo(pic[0].imagen_perfil)
    }
  } else if (elemento === 'publicacion') {
    console.log('eliminando')
    const [pic] = await pool.query('SELECT imagen_publicacion FROM publicaciones WHERE id = ?', [id])
    if (picture !== pic[0].imagen_publicacion) {
      eliminarArchivo(pic[0].imagen_publicacion)
    }
  }
}
