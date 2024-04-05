import { pool } from '../config/db.js'
import fs from 'node:fs'
import { validarCategorias, validarId, validarPublicacion } from '../utils/validation.js'
import { eliminarArchivo, reemplazarFoto } from '../utils/filemanagement.js'
// import jwt from 'jsonwebtoken'
export const basePath = process.cwd()

export const crearPublicacion = async (req, res) => {
  const { titulo, contenido, usuario_id: usuarioId, categorias } = req.body
  const picture = req.file ? req.file.filename : null
  try {
    await validarPublicacion(titulo, contenido, usuarioId, picture, categorias, 'create')
    const query = 'INSERT INTO publicaciones (titulo, contenido, usuario_id, imagen_publicacion) VALUES (?,?,?,?)'
    const [publicacion] = await pool.query(query, [titulo, contenido, usuarioId, picture])
    const [nuevaPublicacion] = await pool.query(
          `SELECT p.id, p.titulo, p.contenido, p.fecha_creacion, u.nombre_usuario AS usuario, p.imagen_publicacion FROM publicaciones p
          LEFT JOIN usuarios u ON u.id = p.usuario_id WHERE p.id = ?`,
          [publicacion.insertId]
    )
    const arrayCategorias = categorias.split(',').map(id => parseInt(id.trim()))
    const categoriasValidas = await validarCategorias(arrayCategorias)
    if (categoriasValidas && categoriasValidas.length > 0) {
      for (const categoriaId of categoriasValidas) {
        await pool.query('INSERT INTO publicaciones_categorias (publicacion_id, categoria_id) VALUES (?, ?)', [publicacion.insertId, categoriaId])
      }
    }
    res.json({ message: 'Publicación creada de forma exitosa', nuevaPublicacion })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Me falta el manejo de las categorias en caso de que se elimine una categoria
export const actualizarPublicacion = async (req, res) => {
  const { id } = req.params
  const { titulo, contenido, usuario_id: usuarioId, categorias } = req.body
  const picture = req.file ? req.file.filename : null
  try {
    await validarId(id)
    await validarPublicacion(titulo, contenido, usuarioId, picture, categorias, 'update')
    const [exist] = await pool.query('SELECT * FROM publicaciones WHERE id = ?', [id])
    if (!exist[0]) {
      res.status(400).json({ message: 'No existe ninguna publicacion con el ID proporcionado' })
    } else {
      let query = 'UPDATE publicaciones SET titulo = ?, contenido = ?, usuario_id = ?, imagen_publicacion = ?'
      const values = [titulo || exist[0].titulo, contenido || exist[0].contenido, usuarioId || exist[0].usuario_id, picture || exist[0].imagen_publicacion]
      query += ' WHERE id = ?'
      values.push(id)
      if (picture) {
        reemplazarFoto(picture, id, 'publicacion')
      }
      await pool.query(query, values)
      const [publicationEditada] = await pool.query(
        `SELECT p.id, p.titulo, p.contenido, p.fecha_creacion, u.nombre_usuario AS usuario, p.imagen_publicacion FROM publicaciones p
        LEFT JOIN usuarios u ON u.id = p.usuario_id WHERE p.id = ?`, [id])

      if (categorias) { // Elimina las relaciones con categorias anteriores
        const queryCategorias = 'DELETE FROM publicaciones_categorias WHERE publicacion_id =?'
        await pool.query(queryCategorias, [id])

        // establece las nuevas relaciones
        const arrayCategorias = categorias.split(',').map(id => parseInt(id.trim()))
        const categoriasValidas2 = await validarCategorias(arrayCategorias)
        if (categoriasValidas2 && categoriasValidas2.length > 0) {
          for (const categoriaId of categoriasValidas2) {
            await pool.query('INSERT INTO publicaciones_categorias (publicacion_id, categoria_id) VALUES (?, ?)', [id, categoriaId])
          }
        }
      }

      res.json({ message: 'Publicación actualizada correctamente', publicationEditada })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const eliminarPublicacion = async (req, res) => {
  const { id } = req.params
  const query = 'DELETE FROM publicaciones WHERE id = ?'
  try {
    await validarId(id)
    const [pic] = await pool.query('SELECT imagen_publicacion FROM  publicaciones WHERE id=?', [id])
    const [result] = await pool.query(query, [id])
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'No se encontró ninguna publicación con el ID proporcionado' })
    } else {
      if (pic[0].imagen_publicacion !== null) {
        eliminarArchivo(pic[0].imagen_publicacion)
      }

      // Eliminar de la tabla publicaciones_categorias todos los registros que tengan publicacion_id = id
      const queryCategorias = 'DELETE FROM publicaciones_categorias WHERE publicacion_id =?'
      await pool.query(queryCategorias, [id])

      // Eliminar de la tabla comentarios todos los registros que tengan publicacion_id = id
      const queryComentarios = 'DELETE FROM comentarios WHERE publicacion_id =?'
      await pool.query(queryComentarios, [id])
      res.status(200).json({ message: 'Se eliminó la publicación correctamente' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerPublicacionPorId = async (req, res) => {
  const { id } = req.params
  const query = `
  SELECT p.*, GROUP_CONCAT(c.nombre_categoria SEPARATOR ', ') AS categorias
  FROM publicaciones p
  LEFT JOIN publicaciones_categorias pc ON p.id = pc.publicacion_id
  LEFT JOIN categorias c ON pc.categoria_id = c.id
  WHERE p.id = ?
  GROUP BY p.id
`
  try {
    await validarId(id)
    const [data] = await pool.query(query, [id])
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No se encontró ninguna publicación con el ID proporcionado' })
    } else {
      const queryComentarios = 'SELECT * FROM comentarios WHERE publicacion_id =?'
      const [comentarios] = await pool.query(queryComentarios, [id])

      if (data[0].imagen_perfil === null) {
        data[0].imagen_perfil = 'placeholder.jpg'
      } else {
        const archivo = basePath + '/public/uploads/' + data[0].imagen_perfil
        fs.access(archivo, fs.constants.F_OK, (err) => {
          if (err) {
            data[0].imagen_perfil = 'avatar.jpg'
          }
        })
      }
      const respuesta = {
        publicacion: data[0],
        comentarios
      }
      res.status(200).json(respuesta)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerPublicaciones = async (req, res) => {
  // Obtener todas las publicaciones de la tabla publicaciones
  const query = `
    SELECT p.*, GROUP_CONCAT(c.nombre_categoria SEPARATOR ', ') AS categorias
    FROM publicaciones p
    LEFT JOIN publicaciones_categorias pc ON p.id = pc.publicacion_id
    LEFT JOIN categorias c ON pc.categoria_id = c.id
    GROUP BY p.id
    ORDER BY p.fecha_creacion DESC
    `
  try {
    const [data] = await pool.query(query)
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No se encontraron publicaciones' })
    } else {
      for (const publicacion of data) {
        if (publicacion.imagen_publicacion === null) {
          publicacion.imagen_publicacion = 'placeholder.jpg'
        } else {
          const archivo = basePath + '/public/uploads/' + publicacion.imagen_publicacion
          try {
            fs.accessSync(archivo, fs.constants.F_OK)
          } catch (err) {
            publicacion.imagen_publicacion = 'placeholder.jpg'
          }
        }
      }
      res.status(200).json(data)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const publicacionesPorUsuario = async (req, res) => {
  // Obtener todas las publicaciones en las que usuario_id sea igual al id proporcionada en los paramentros
  const { id } = req.params
  // verificar si existe en la tabla de usuarios algun usuario con el id proporcionado
  const [exist] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])
  if (!exist[0]) {
    res.status(400).json({ message: 'No existe un usuario con el ID proporcionado' })
  } else {
    const query = `
    SELECT p.*, GROUP_CONCAT(c.nombre_categoria SEPARATOR ', ') AS categorias
    FROM publicaciones p
    LEFT JOIN publicaciones_categorias pc ON p.id = pc.publicacion_id
    LEFT JOIN categorias c ON pc.categoria_id = c.id
    WHERE p.usuario_id =?
    GROUP BY p.id
    ORDER BY p.fecha_creacion DESC
    `
    try {
      const [data] = await pool.query(query, [id])
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No se encontraron publicaciones realizadas por el Usuario' })
      } else {
        for (const publicacion of data) {
          if (publicacion.imagen_publicacion === null) {
            publicacion.imagen_publicacion = 'placeholder.jpg'
          } else {
            const archivo = basePath + '/public/uploads/' + publicacion.imagen_publicacion
            try {
              fs.accessSync(archivo, fs.constants.F_OK)
            } catch (err) {
              publicacion.imagen_publicacion = 'placeholder.jpg'
            }
          }
        }
        res.status(200).json(data)
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export const publicacionesPorCategoria = async (req, res) => {
// Obtener todas las publicaciones en las que la categoria sea igual al id de la categoria proporcionada en los parametros
  const { id } = req.params
  const [exist] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id])
  if (!exist[0]) {
    res.status(400).json({ message: 'No existe una categoria con el ID proporcionado' })
  } else {
    const query = `
    SELECT p.*, GROUP_CONCAT(c.nombre_categoria SEPARATOR ', ') AS categorias
    FROM publicaciones p
    LEFT JOIN publicaciones_categorias pc ON p.id = pc.publicacion_id
    LEFT JOIN categorias c ON pc.categoria_id = c.id
    WHERE c.id =?
    GROUP BY p.id
    ORDER BY p.fecha_creacion DESC
    `
    try {
      const [data] = await pool.query(query, [id])
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No se encontraron publicaciones con esta categoría' })
      } else {
        for (const publicacion of data) {
          if (publicacion.imagen_publicacion === null) {
            publicacion.imagen_publicacion = 'placeholder.jpg'
          } else {
            const archivo = basePath + '/public/uploads/' + publicacion.imagen_publicacion
            try {
              fs.accessSync(archivo, fs.constants.F_OK)
            } catch (err) {
              publicacion.imagen_publicacion = 'placeholder.jpg'
            }
          }
        }
        res.status(200).json(data)
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
