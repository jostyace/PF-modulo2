import express from 'express'
import {
  crearComentario,
  obtenerComentarios,
  obtenerComentarioPorId,
  actualizarComentario,
  eliminarComentario
} from '../controllers/comentarios.controller.js'
import { estaLogeado, propietarioComentario } from '../utils/validation.js'

const router = express.Router({ mergeParams: true })
/**
 * @openapi
 * /api/publicaciones/{publicacionId}/comentarios:
 *   post:
 *     summary: Crea un comentario en una publicación
 *     tags:
 *       - Comentarios
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: publicacionId
 *         required: true
 *         description: ID de la publicación donde se creará el comentario
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               contenido:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comentario creado correctamente.
 *       400:
 *         description: Bad Request. El ID del usuario y el contenido del comentario son obligatorios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El ID del usuario y el contenido del comentario son obligatorios.
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
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se pudo crear el comentario.
 */
router.post('/publicaciones/:publicacionId/comentarios', estaLogeado, crearComentario)

/**
 * @openapi
 * /api/publicaciones/{publicacionId}/comentarios:
 *   get:
 *     summary: Obtiene los comentarios de una publicación por su ID
 *     tags:
 *       - Comentarios
 *     parameters:
 *       - in: path
 *         name: publicacionId
 *         required: true
 *         description: ID de la publicación de la cual se obtendrán los comentarios
 *         schema:
 *           type: integer
 *           format: int64
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
 *                   publicacion_id:
 *                     type: integer
 *                     example: 1
 *                   usuario_id:
 *                     type: integer
 *                     example: 1
 *                   contenido:
 *                     type: string
 *                     example: "Contenido del comentario"
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 *                     example: "2022-04-07T12:30:00Z"
 *       404:
 *         description: Publicación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Publicación no encontrada
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
router.get('/publicaciones/:publicacionId/comentarios', obtenerComentarios)

/**
 * @openapi
 * /api/comentarios/{id}:
 *   get:
 *     summary: Obtiene un comentario por su ID
 *     tags:
 *       - Comentarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comentario a obtener
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 publicacion_id:
 *                   type: integer
 *                   example: 1
 *                 usuario_id:
 *                   type: integer
 *                   example: 1
 *                 contenido:
 *                   type: string
 *                   example: "Contenido del comentario"
 *                 fecha_creacion:
 *                   type: string
 *                   format: date-time
 *                   example: "2022-04-07T12:30:00Z"
 *       404:
 *         description: Comentario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comentario no encontrado
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
router.get('/comentarios/:id', obtenerComentarioPorId)

/**
 * @openapi
 * /api/comentarios/{id}:
 *   patch:
 *     summary: Actualiza un comentario por su ID
 *     tags:
 *       - Comentarios
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comentario a actualizar
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contenido:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 publicacion_id:
 *                   type: integer
 *                   example: 1
 *                 usuario_id:
 *                   type: integer
 *                   example: 1
 *                 contenido:
 *                   type: string
 *                   example: "Nuevo contenido del comentario"
 *                 fecha_creacion:
 *                   type: string
 *                   format: date-time
 *                   example: "2022-04-07T12:30:00Z"
 *       403:
 *         description: No se encontró el comentario o no tienes permiso para actualizarlo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró el comentario o no tienes permiso para actualizarlo
 *       404:
 *         description: El comentario no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El comentario no existe
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
router.patch('/comentarios/:id', estaLogeado, propietarioComentario, actualizarComentario)

/**
 * @openapi
 * /api/comentarios/{id}:
 *   delete:
 *     summary: Elimina un comentario por su ID
 *     tags:
 *       - Comentarios
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comentario a eliminar
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Comentario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comentario eliminado correctamente
 *       403:
 *         description: No tienes permiso para eliminar este comentario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permiso para eliminar este comentario
 *       404:
 *         description: El comentario no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El comentario no existe
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
router.delete('/comentarios/:id', estaLogeado, propietarioComentario, eliminarComentario)

export default router
