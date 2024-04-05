import { pool } from '../config/db.js'
import { validarElemento, validarId } from '../utils/validation.js'

export const crearRol = async (req, res) => {
  const { nombre_rol: rol } = req.body
  try {
    validarElemento(rol, 'rol', 3, 20)
    const query = 'INSERT INTO roles (nombre_rol) VALUES (?)'
    await pool.query(query, [rol])
    res.status(200).json({ message: 'Rol creado satisfactoriamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerRoles = async (req, res) => {
  const query = 'SELECT * FROM roles'
  try {
    const [data] = await pool.query(query)
    if (data[0] == null) {
      res.status(500).json({ message: 'No se encontro ningun rol' })
    } else {
      res.status(200).json(data)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerRolPorId = async (req, res) => {
  const { id } = req.params
  const query = 'SELECT * FROM roles WHERE id =?'
  try {
    await validarId(id)
    const [data] = await pool.query(query, [id])
    if (data[0] == null) {
      res.status(500).json({ message: 'No se encontro ningun rol con el ID proporcionado' })
    } else {
      res.status(200).json(data)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const actualizarRol = async (req, res) => {
  const { id } = req.params
  const { nombre_rol: rol } = req.body
  try {
    await validarElemento(rol, 'rol', 3, 20)
    await validarId(id)
    const [result] = await pool.query('UPDATE roles SET nombre_rol = ? WHERE id = ?', [rol, id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró ningún rol con el ID proporcionado' })
    } else {
      res.status(200).json({ message: 'Rol actualizado correctamente' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const eliminarRol = async (req, res) => {
  const { id } = req.params
  const query = 'DELETE FROM roles WHERE id = ?'
  try {
    await validarId(id)
    const [result] = await pool.query(query, [id])
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'No se encontró ningún rol con el ID proporcionado' })
    } else {
      res.status(200).json({ message: 'Se eliminó el Rol correctamente' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
