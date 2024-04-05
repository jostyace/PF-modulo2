import { pool } from '../config/db.js'
import fs from 'node:fs'
import bcrypt from 'bcrypt'
import { validarCampos, validarId } from '../utils/validation.js'
import { eliminarArchivo, reemplazarFoto } from '../utils/filemanagement.js'
import { eliminarPublicacion } from './publicaciones.controller.js'
// import jwt from 'jsonwebtoken'
export const basePath = process.cwd()

export const registrarUsuario = async (req, res) => {
  const { username, email, password } = req.body
  const picture = req.file ? req.file.filename : null
  try {
    await validarCampos(username, email, 2, picture, password, 'create')
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashPassword = await bcrypt.hash(password, salt)
    const query = 'INSERT INTO usuarios (nombre_usuario, correo_electronico, contrasena, rol_id, imagen_perfil) VALUES (?,?,?,?,?)'
    const [user] = await pool.query(query, [username, email, hashPassword, 2, picture])
    const [newUser] = await pool.query(
        `SELECT u.id, u.nombre_usuario, u.correo_electronico, r.nombre_rol AS rol, u.imagen_perfil FROM usuarios u
        LEFT JOIN roles r ON r.id = u.rol_id WHERE u.id = ?`,
        [user.insertId]
    )
    res.json({ message: 'Usuario creado correctamente', newUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params
  const { username, email, password } = req.body
  const picture = req.file ? req.file.filename : null
  try {
    await validarId(id)
    await validarCampos(username, email, 2, picture, password, 'update')
    const [exist] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])
    if (!exist[0]) {
      res.status(400).json({ message: 'No existe un usuario con el ID proporcionado' })
    } else {
      let query = 'UPDATE usuarios SET nombre_usuario = ?, correo_electronico = ?, rol_id = ?, imagen_perfil = ?'
      const values = [username || exist[0].nombre_usuario, email || exist[0].correo_electronico, 2, picture || exist[0].imagen_perfil]
      if (password) {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashPassword = await bcrypt.hash(password, salt)
        query += ', contrasena = ?'
        values.push(hashPassword)
      }
      query += ' WHERE id = ?'
      values.push(id)
      if (picture) {
        reemplazarFoto(picture, id, 'usuario')
      }
      await pool.query(query, values)
      const [editedUser] = await pool.query(
          `SELECT u.id, u.nombre_usuario, u.correo_electronico, r.nombre_rol AS rol, u.imagen_perfil FROM usuarios u
          LEFT JOIN roles r ON r.id = u.rol_id WHERE u.id = ?`, [id])
      res.json({ message: 'Usuario actualizado correctamente', editedUser })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const actualizarUsuarioAdmin = async (req, res) => {
  const { id } = req.params
  const { username, email, role_id: roleId, password } = req.body
  const picture = req.file ? req.file.filename : null
  try {
    await validarId(id)
    await validarCampos(username, email, roleId, picture, password, 'update')
    const [exist] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])
    if (!exist[0]) {
      res.status(400).json({ message: 'No existe un usuario con el ID proporcionado' })
    } else {
      let query = 'UPDATE usuarios SET '
      const values = []
      if (username) {
        query += 'nombre_usuario = ?, '
        values.push(username)
      }
      if (email) {
        query += 'correo_electronico = ?, '
        values.push(email)
      }
      if (roleId !== undefined) {
        query += 'rol_id = ?, '
        values.push(roleId)
      }
      if (picture) {
        query += 'imagen_perfil = ?'
        values.push(picture)
      }
      if (password) {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashPassword = await bcrypt.hash(password, salt)
        query += ', contrasena = ?'
        values.push(hashPassword)
      }
      query += ' WHERE id = ?'
      values.push(id)
      reemplazarFoto(picture, id)
      await pool.query(query, values)
      const [editedUser] = await pool.query(
          `SELECT u.id, u.nombre_usuario, u.correo_electronico, r.nombre_rol AS rol, u.imagen_perfil FROM usuarios u
          LEFT JOIN roles r ON r.id = u.rol_id WHERE u.id = ?`, [id]
      )
      res.json({ message: 'Usuario actualizado correctamente', editedUser })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params
  try {
    await validarId(id)
    const [exist] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])
    if (!exist[0]) {
      res.status(400).json({ message: 'No existe un usuario con el ID proporcionado' })
    } else {
      const { imagen_perfil: imagenPerfil } = exist[0]
      const query = 'DELETE FROM usuarios WHERE id = ?'
      await pool.query(query, id)
      eliminarArchivo(imagenPerfil)
      const [publicaciones] = await pool.query('SELECT id FROM publicaciones WHERE usuario_id = ?', [id])
      for (const publicacion of publicaciones) {
        await eliminarPublicacion(publicacion.id)
      }
      res.status(200).json({ message: 'El usuario con id ' + id + ' y sus publicaciones fueron eliminadas' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params
  try {
    await validarId(id)
    const [exist] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])
    if (!exist[0]) {
      res.status(400).json({ message: 'No existe un usuario con el ID proporcionado' })
    } else {
      const query = `SELECT u.id, u.nombre_usuario, u.correo_electronico, r.nombre_rol AS rol, r.id AS rol_id, u.imagen_perfil FROM usuarios u
        LEFT JOIN roles r ON r.id = u.rol_id WHERE u.id = ?`
      const [users] = await pool.query(query, id)
      if (users[0].imagen_perfil === null) {
        users[0].imagen_perfil = 'avatar.jpg'
        res.json(users)
      } else {
        const archivo = basePath + '/public/uploads/' + users[0].imagen_perfil
        fs.access(archivo, fs.constants.F_OK, (err) => {
          if (err) {
            users[0].imagen_perfil = 'avatar.jpg'
          }
          res.json(users)
        })
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerTodosUsuarios = async (req, res) => {
  try {
    const [exist] = await pool.query('SELECT * FROM usuarios')
    if (!exist[0]) {
      res.status(400).json({ message: 'Users not found' })
    } else {
      const query = `SELECT u.id, u.nombre_usuario, u.correo_electronico, r.nombre_rol AS rol, u.imagen_perfil FROM usuarios u
          LEFT JOIN roles r ON r.id = u.rol_id`
      const [users] = await pool.query(query)
      for (const user of users) {
        if (user.imagen_perfil === null) {
          user.imagen_perfil = 'avatar.jpg'
        } else {
          const archivo = basePath + '/public/uploads/' + user.imagen_perfil
          try {
            fs.accessSync(archivo, fs.constants.F_OK)
          } catch (err) {
            user.imagen_perfil = 'avatar.jpg'
          }
        }
      }
      res.json(users)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const iniciarSesion = async (req, res) => {
  const { username, password } = req.body
  try {
    const [user] = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [username])
    if (!user || user.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }
    const passwordMatch = await bcrypt.compare(password, user[0].contrasena)
    if (!passwordMatch) {
      delete req.session.userId
      delete req.session.userRole
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }
    // const token = jwt.sign({ userId: user[0].id, username: user[0].nombre_usuario }, 'secreto', { expiresIn: '1h' })
    req.session.userId = user[0].id
    req.session.userRole = user[0].rol_id
    res.json({ message: 'Inicio de sesión exitoso' })
    // res.json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const cerrarSesion = (req, res) => {
  delete req.session.userId
  delete req.session.userRole

  res.json({ message: 'Sesión cerrada exitosamente' })
}
