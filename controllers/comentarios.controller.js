import { pool } from '../config/db.js'
import { validarId } from '../utils/validation.js'

export const crearComentario = async (req, res) => {
  const { publicacionId } = req.params
  const { usuarioId, contenido } = req.body

  try {
    await validarId(publicacionId)
    await validarId(usuarioId)

    if (!usuarioId || !contenido) {
      return res.status(400).json({ message: 'El ID del usuario y el contenido del comentario son obligatorios.' })
    }
    const query = 'INSERT INTO comentarios (publicacion_id, usuario_id, contenido) VALUES (?, ?, ?)'
    const [result] = await pool.query(query, [publicacionId, usuarioId, contenido])
    if (result.affectedRows === 1) {
      return res.status(201).json({ message: 'Comentario creado correctamente.' })
    } else {
      return res.status(500).json({ message: 'No se pudo crear el comentario.' })
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export const obtenerComentarios = async (req, res) => {
  const { publicacionId } = req.params
  try {
    await validarId(publicacionId)
    const [existe] = await pool.query('SELECT id FROM publicaciones WHERE id = ?', publicacionId)
    if (!existe || existe.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }
    const query = 'SELECT * FROM comentarios WHERE publicacion_id = ?'
    const [comentarios] = await pool.query(query, [publicacionId])
    return res.status(200).json(comentarios)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export const obtenerComentarioPorId = async (req, res) => {
  const { id } = req.params

  try {
    await validarId(id)
    const query = 'SELECT * FROM comentarios WHERE id = ?'
    const [comentario] = await pool.query(query, [id])
    if (!comentario || comentario.length === 0) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }
    return res.status(200).json(comentario[0])
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export const actualizarComentario = async (req, res) => {
  const { id } = req.params
  const { contenido } = req.body

  try {
    await validarId(id)
    const [comentarioExistente] = await pool.query('SELECT * FROM comentarios WHERE id = ?', [id])
    if (!comentarioExistente || comentarioExistente.length === 0) {
      return res.status(403).json({ message: 'No se encontro el comentario' })
    }
    const query = 'UPDATE comentarios SET contenido = ? WHERE id = ?'
    await pool.query(query, [contenido, id])
    const [comentarioActualizado] = await pool.query('SELECT * FROM comentarios WHERE id = ?', [id])
    return res.status(200).json(comentarioActualizado[0])
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export const eliminarComentario = async (req, res) => {
  const { id: comentarioId } = req.params
  const { userId } = req.body

  try {
    await validarId(comentarioId)
    const [comentarioExistente] = await pool.query('SELECT * FROM comentarios WHERE id = ? AND usuario_id = ?', [comentarioId, userId])
    if (!comentarioExistente || comentarioExistente.length === 0) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' })
    }
    await pool.query('DELETE FROM comentarios WHERE id = ?', [comentarioId])
    return res.status(200).json({ message: 'Comentario eliminado correctamente' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
