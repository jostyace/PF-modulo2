import express from 'express'

import { subirArchivos } from '../config/multer.js'
import {
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerTodosUsuarios,
  obtenerUsuarioPorId,
  iniciarSesion,
  cerrarSesion
} from '../controllers/usuarios.controller.js'
import { esPropietario, estaLogeado } from '../utils/validation.js'

const router = express.Router()

/**
 * @openapi
 * /api/usuarios:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario creado correctamente
 *                 newUser:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre_usuario:
 *                       type: string
 *                       example: usuario1
 *                     correo_electronico:
 *                       type: string
 *                       example: usuario1@example.com
 *                     rol:
 *                       type: string
 *                       example: Usuario
 *                     imagen_perfil:
 *                       type: string
 *                       format: binary
 *                       example: profile-picture.jpg
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/usuarios', subirArchivos.single('picture'), registrarUsuario)

/**
 * @openapi
 * /api/usuarios/{id}:
 *   patch:
 *     summary: Actualiza un usuario existente
 *     tags:
 *       - Usuarios
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario actualizado correctamente
 *                 editedUser:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre_usuario:
 *                       type: string
 *                       example: usuario1
 *                     correo_electronico:
 *                       type: string
 *                       example: usuario1@example.com
 *                     rol:
 *                       type: string
 *                       example: Usuario
 *                     imagen_perfil:
 *                       type: string
 *                       format: binary
 *                       example: profile-picture.jpg
 *       400:
 *         description: No existe un usuario con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No existe un usuario con el ID proporcionado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.patch('/usuarios/:id', estaLogeado, esPropietario, subirArchivos.single('picture'), actualizarUsuario)

/**
 * @openapi
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario y sus publicaciones asociadas
 *     tags:
 *       - Usuarios
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: El usuario y sus publicaciones fueron eliminadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El usuario con id 1 y sus publicaciones fueron eliminadas
 *       400:
 *         description: No existe un usuario con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No existe un usuario con el ID proporcionado
 *       401:
 *         description: Acceso no autorizado. Debes iniciar sesión.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso no autorizado. Debes iniciar sesión.
 *       403:
 *         description: Acceso denegado. No tienes permiso para realizar esta acción.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso denegado. No tienes permiso para realizar esta acción.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete('/usuarios/:id', estaLogeado, esPropietario, eliminarUsuario)

/**
 * @openapi
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del usuario
 *                     example: 1
 *                   nombre_usuario:
 *                     type: string
 *                     description: Nombre de usuario
 *                     example: usuario1
 *                   correo_electronico:
 *                     type: string
 *                     description: Correo electrónico del usuario
 *                     example: usuario1@example.com
 *                   rol:
 *                     type: string
 *                     description: Nombre del rol del usuario
 *                     example: Administrador
 *                   imagen_perfil:
 *                     type: string
 *                     description: Nombre de archivo de imagen de perfil del usuario
 *                     example: avatar.jpg
 *       400:
 *         description: Usuarios no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users not found
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/usuarios', obtenerTodosUsuarios)

/**
 * @openapi
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del usuario solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del usuario
 *                   example: 1
 *                 nombre_usuario:
 *                   type: string
 *                   description: Nombre de usuario
 *                   example: usuario1
 *                 correo_electronico:
 *                   type: string
 *                   description: Correo electrónico del usuario
 *                   example: usuario1@example.com
 *                 rol:
 *                   type: string
 *                   description: Nombre del rol del usuario
 *                   example: Administrador
 *                 rol_id:
 *                   type: integer
 *                   description: ID del rol del usuario
 *                   example: 1
 *                 imagen_perfil:
 *                   type: string
 *                   description: Nombre de archivo de imagen de perfil del usuario
 *                   example: avatar.jpg
 *       400:
 *         description: No se encontró un usuario con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No existe un usuario con el ID proporcionado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/usuarios/:id', obtenerUsuarioPorId)

/**
 * @openapi
 * /api/entrar:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del usuario
 *                 example: usuario1
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credenciales incorrectas
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/entrar', iniciarSesion)

/**
 * @openapi
 * /api/salir:
 *   post:
 *     summary: Cierra sesión de usuario
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sesión cerrada exitosamente
 */
router.post('/salir', cerrarSesion)

export default router
