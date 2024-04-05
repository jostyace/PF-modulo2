import { pool } from '../config/db.js'
import { validarElemento, validarId } from '../utils/validation.js'

export const crearCategoria = async (req, res) => {
  const { nombre_categoria: categoria } = req.body
  try {
    validarElemento(categoria, 'categoría', 3, 30)
    const query = 'INSERT INTO categorias (nombre_categoria) VALUES (?)'
    await pool.query(query, [categoria])
    res.status(200).json({ message: 'Categoria creada satisfactoriamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerCategorias = async (req, res) => {
  const query = 'SELECT * FROM categorias'
  try {
    const [data] = await pool.query(query)
    if (data[0] == null) {
      res.status(500).json({ message: 'No se encontro ninguna categoría' })
    } else {
      res.status(200).json(data)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerCategoriaPorId = async (req, res) => {
  const { id } = req.params
  const query = 'SELECT * FROM categorias WHERE id =?'
  try {
    await validarId(id)
    const [data] = await pool.query(query, [id])
    if (data[0] == null) {
      res.status(500).json({ message: 'No se encontro ninguna categoria con el ID proporcionado' })
    } else {
      res.status(200).json(data)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const actualizarCategoria = async (req, res) => {
  const { id } = req.params
  const { nombre_categoria: categoria } = req.body
  try {
    validarElemento(categoria, 'categoría', 3, 30)
    await validarId(id)
    const [result] = await pool.query('UPDATE categorias SET nombre_categoria = ? WHERE id = ?', [categoria, id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró ninguna categoría con el ID proporcionado' })
    } else {
      res.status(200).json({ message: 'Categoría actualizada correctamente' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const eliminarCategoria = async (req, res) => {
  const { id } = req.params
  const query = 'DELETE FROM categorias WHERE id = ?'
  try {
    await validarId(id)
    const [result] = await pool.query(query, [id])
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'No se encontró ninguna categoria con el ID proporcionado' })
    } else {
      const queryCategorias = 'DELETE FROM publicaciones_categorias WHERE categoria_id =?'
      await pool.query(queryCategorias, [id])
      res.status(200).json({ message: 'Se eliminó la Categoría correctamente' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
