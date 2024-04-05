import { eliminarArchivo } from './filemanagement.js'
import { pool } from '../config/db.js'

// Funciones de validacion
export function validarElemento (elemento, nombreElemento, min, max) {
  const minimo = min
  const maximo = max

  if (!elemento) {
    throw new Error(`Debe ingresar un nombre de ${nombreElemento}`)
  }
  if (!elemento || typeof elemento !== 'string') {
    throw new Error(`El nombre de ${nombreElemento} es requerido y debe ser una cadena de caracteres.`)
  }
  if (elemento.length < minimo || elemento.length > maximo) {
    throw new Error(`El nombre de ${nombreElemento} debe tener entre ${minimo} y ${maximo} caracteres.`)
  }
}

export async function validarId (id) {
  const parsedId = parseInt(id)
  if (!Number.isInteger(parsedId) || isNaN(parsedId) || parsedId <= 0) {
    throw new Error('ID es inválido')
  }
}

export async function validarCampos (name, email, roleId, picture, password, action) {
  const [emailDuplicated] = await pool.query('SELECT id FROM usuarios WHERE correo_electronico = ?', [email])
  const [usernameDuplicated] = await pool.query('SELECT id FROM usuarios WHERE nombre_usuario = ?', [name])
  if (action === 'create') {
    if (!name || !email || !roleId || !password) {
      eliminarArchivo(picture)
      throw new Error('Todos los campos son requeridos')
    }

    if (!isValidEmail(email)) {
      eliminarArchivo(picture)
      throw new Error('El email es inválido')
    }
    if (!Number.isInteger(parseInt(roleId)) || roleId > 2 || parseInt(roleId) === 0) {
      eliminarArchivo(picture)
      throw new Error('El ID del Rol es inválido')
    }
    if (emailDuplicated.length !== 0) {
      eliminarArchivo(picture)
      throw new Error('El email ingresado ya está en uso')
    }
    if (usernameDuplicated.length !== 0) {
      eliminarArchivo(picture)
      throw new Error('El usuario ingresado ya está en uso')
    }
    if (!picture) {
      throw new Error('Es necesario adjuntar la imagen')
    }
  } else if (action === 'update') {
    if (email && !isValidEmail(email)) {
      throw new Error('El email es inválido')
    }
    if (emailDuplicated.length > 1) {
      eliminarArchivo(picture)
      throw new Error('El email ingresado ya está en uso es inválido')
    }
    if (usernameDuplicated.length > 1) {
      eliminarArchivo(picture)
      throw new Error('El usuario ingresado ya está en uso es inválido')
    }
  }
}

export async function validarPublicacion (titulo, contenido, usuarioId, picture, categorias, accion) {
  if (accion === 'create') {
    if (!titulo || !contenido || !usuarioId || !picture) {
      eliminarArchivo(picture)
      throw new Error('Todos los campos son requeridos')
    }
    if (!Number.isInteger(parseInt(usuarioId)) || parseInt(usuarioId) === 0) {
      eliminarArchivo(picture)
      throw new Error('El ID de usuario es inválido')
    }
    const [usuarioExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [usuarioId])
    if (usuarioExiste.length === 0) {
      eliminarArchivo(picture)
      throw new Error('No existe el usuario')
    }
    if (!categorias || categorias.length === 0) {
      eliminarArchivo(picture)
      throw new Error('Debe proporcionar al menos una categoría')
    }
    if (!picture) {
      throw new Error('Es necesario adjuntar la imagen')
    }
  }
}

export async function validarCategorias (categorias) {
  const categoriasExistentes = []
  for (const id of categorias) {
    try {
      const [resultado] = await pool.query('SELECT id FROM categorias WHERE id = ?', [id])
      if (resultado.length > 0) {
        categoriasExistentes.push(resultado[0].id)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return categoriasExistentes
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const esAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole) {
    if (req.session.userRole === 1) {
      next()
    } else {
      res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' })
    }
  } else {
    res.status(401).json({ message: 'Acceso no autorizado. Debes iniciar sesión como administrador.' })
  }
}

export const estaLogeado = (req, res, next) => {
  if (req.session && req.session.userId) {
    next()
  } else {
    res.status(401).json({ message: 'Acceso no autorizado. Debes iniciar sesión.' })
  }
}

export const esPropietario = (req, res, next) => {
  const userId = req.session.userId
  const { id } = req.params
  if (parseInt(userId) !== parseInt(id)) {
    return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para realizar esta acción.' })
  }
  next()
}

export const propietarioPublicacion = async (req, res, next) => {
  const userId = req.session.userId
  const { id } = req.params
  try {
    const [publicacion] = await pool.query('SELECT usuario_id FROM publicaciones WHERE id = ?', [id])
    if (!publicacion || publicacion.length === 0) {
      return res.status(404).json({ message: 'La publicación no existe.' })
    }
    if (publicacion[0].usuario_id !== userId) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para realizar esta acción.' })
    }
    next()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const propietarioComentario = async (req, res, next) => {
  const userId = req.session.userId
  const { id } = req.params
  try {
    const [comentario] = await pool.query('SELECT usuario_id FROM comentarios WHERE id = ?', [id])
    if (!comentario || comentario.length === 0) {
      return res.status(404).json({ message: 'El comentario no existe.' })
    }
    if (comentario[0].usuario_id !== userId) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para realizar esta acción.' })
    }
    next()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
