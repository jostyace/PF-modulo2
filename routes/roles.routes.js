import express from 'express'
import {
  crearRol,
  obtenerRoles,
  obtenerRolPorId,
  actualizarRol,
  eliminarRol
} from '../controllers/roles.controller.js'
import { esAdmin } from '../utils/validation.js'

const router = express.Router()

/**
 * @openapi
 * /api/roles:
 *   post:
 *     summary: Crea un nuevo rol
 *     tags:
 *       - Roles
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_rol:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *     responses:
 *       200:
 *         description: Rol creado satisfactoriamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rol creado satisfactoriamente
 *       401:
 *         description: Acceso no autorizado. Debes iniciar sesión como administrador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso no autorizado. Debes iniciar sesión como administrador.
 *       403:
 *         description: Acceso denegado. Solo los administradores pueden realizar esta acción.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso denegado. Solo los administradores pueden realizar esta acción.
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
router.post('/roles', esAdmin, crearRol)

/**
 * @openapi
 * /api/roles/{id}:
 *   patch:
 *     summary: Actualiza un rol por su ID
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol a actualizar
 *         schema:
 *           type: integer
 *           format: int64
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_rol:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rol actualizado correctamente
 *       401:
 *         description: Acceso no autorizado. Debes iniciar sesión como administrador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso no autorizado. Debes iniciar sesión como administrador.
 *       403:
 *         description: Acceso denegado. Solo los administradores pueden realizar esta acción.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso denegado. Solo los administradores pueden realizar esta acción.
 *       404:
 *         description: No se encontró ningún rol con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró ningún rol con el ID proporcionado
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
router.patch('/roles/:id', esAdmin, actualizarRol)

/**
 * @openapi
 * /api/roles/{id}:
 *   delete:
 *     summary: Elimina un rol por su ID
 *     tags:
 *       - Roles
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol a eliminar
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Rol eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Se eliminó el Rol correctamente
 *       401:
 *         description: Acceso no autorizado. Debes iniciar sesión como administrador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso no autorizado. Debes iniciar sesión como administrador.
 *       403:
 *         description: Acceso denegado. Solo los administradores pueden realizar esta acción.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso denegado. Solo los administradores pueden realizar esta acción.
 *       404:
 *         description: No se encontró ningún rol con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró ningún rol con el ID proporcionado
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
router.delete('/roles/:id', esAdmin, eliminarRol)

/**
 * @openapi
 * /api/roles:
 *   get:
 *     summary: Obtiene todos los roles
 *     tags:
 *       - Roles
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre_rol:
 *                     type: string
 *                     example: "Nombre del rol"
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
router.get('/roles', obtenerRoles)

/**
 * @openapi
 * /api/roles/{id}:
 *   get:
 *     summary: Obtiene un rol por su ID
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a obtener
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre_rol:
 *                     type: string
 *                     example: "Nombre del rol"
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
router.get('/roles/:id', obtenerRolPorId)

export default router
