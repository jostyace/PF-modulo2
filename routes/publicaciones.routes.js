import express from 'express'
import {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  actualizarPublicacion,
  eliminarPublicacion,
  publicacionesPorUsuario,
  publicacionesPorCategoria
} from '../controllers/publicaciones.controller.js'
import { subirArchivos } from '../config/multer.js'
import { estaLogeado, propietarioPublicacion } from '../utils/validation.js'

const router = express.Router({ mergeParams: true })
/**
 * @openapi
 * /api/publicaciones:
 *   post:
 *     summary: Crea una nueva publicación
 *     tags:
 *       - Publicaciones
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               contenido:
 *                 type: string
 *               usuario_id:
 *                 type: integer
 *               categorias:
 *                 type: string
 *                 description: 'IDs de las categorías separados por coma (e.g., 1,2,3)'
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Publicación creada de forma exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Publicación creada de forma exitosa
 *                 nuevaPublicacion:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: Mi publicación
 *                     contenido:
 *                       type: string
 *                       example: Contenido de la publicación
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-04-05T12:00:00Z
 *                     usuario:
 *                       type: string
 *                       example: usuario1
 *                     imagen_publicacion:
 *                       type: string
 *                       example: imagen.png
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
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
 */
router.post('/publicaciones', estaLogeado, subirArchivos.single('imagen'), crearPublicacion)

/**
 * @openapi
 * /api/publicaciones:
 *   get:
 *     summary: Obtiene todas las publicaciones
 *     tags:
 *       - Publicaciones
 *     responses:
 *       200:
 *         description: Lista de publicaciones obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID de la publicación
 *                   titulo:
 *                     type: string
 *                     description: Título de la publicación
 *                   contenido:
 *                     type: string
 *                     description: Contenido de la publicación
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación de la publicación
 *                   usuario_id:
 *                     type: integer
 *                     description: ID del usuario que creó la publicación
 *                   imagen_publicacion:
 *                     type: string
 *                     description: Nombre del archivo de la imagen de la publicación
 *                   categorias:
 *                     type: string
 *                     description: Categorías de la publicación separadas por coma
 *       404:
 *         description: No se encontraron publicaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontraron publicaciones
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.get('/publicaciones', obtenerPublicaciones)

/**
 * @openapi
 * /api/publicaciones/{id}:
 *   get:
 *     summary: Obtiene una publicación por su ID
 *     tags:
 *       - Publicaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la publicación a obtener
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Publicación obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 publicacion:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID de la publicación
 *                     titulo:
 *                       type: string
 *                       description: Título de la publicación
 *                     contenido:
 *                       type: string
 *                       description: Contenido de la publicación
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 *                       description: Fecha de creación de la publicación
 *                     usuario_id:
 *                       type: integer
 *                       description: ID del usuario que creó la publicación
 *                     imagen_publicacion:
 *                       type: string
 *                       description: Nombre del archivo de la imagen de la publicación
 *                     categorias:
 *                       type: string
 *                       description: Categorías de la publicación separadas por coma
 *                 comentarios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID del comentario
 *                       contenido:
 *                         type: string
 *                         description: Contenido del comentario
 *                       fecha_creacion:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha de creación del comentario
 *       404:
 *         description: No se encontró ninguna publicación con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró ninguna publicación con el ID proporcionado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.get('/publicaciones/:id', obtenerPublicacionPorId)

/**
 * @openapi
 * /api/publicaciones/usuario/{id}:
 *   get:
 *     summary: Obtiene todas las publicaciones realizadas por un usuario dado su ID
 *     tags:
 *       - Publicaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del usuario del cual se desean obtener las publicaciones
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Publicaciones obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID de la publicación
 *                   titulo:
 *                     type: string
 *                     description: Título de la publicación
 *                   contenido:
 *                     type: string
 *                     description: Contenido de la publicación
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación de la publicación
 *                   usuario_id:
 *                     type: integer
 *                     description: ID del usuario que realizó la publicación
 *                   imagen_publicacion:
 *                     type: string
 *                     description: URL de la imagen de la publicación
 *                   categorias:
 *                     type: string
 *                     description: Categorías de la publicación separadas por comas
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
 *       404:
 *         description: No se encontraron publicaciones realizadas por el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontraron publicaciones realizadas por el usuario
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.get('/publicaciones/usuario/:id', publicacionesPorUsuario)

/**
 * @openapi
 * /api/publicaciones/categoria/{id}:
 *   get:
 *     summary: Obtiene todas las publicaciones asociadas a una categoría dada su ID
 *     tags:
 *       - Publicaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la categoría de la cual se desean obtener las publicaciones
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Publicaciones obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID de la publicación
 *                   titulo:
 *                     type: string
 *                     description: Título de la publicación
 *                   contenido:
 *                     type: string
 *                     description: Contenido de la publicación
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación de la publicación
 *                   usuario_id:
 *                     type: integer
 *                     description: ID del usuario que realizó la publicación
 *                   imagen_publicacion:
 *                     type: string
 *                     description: URL de la imagen de la publicación
 *                   categorias:
 *                     type: string
 *                     description: Categorías de la publicación separadas por comas
 *       400:
 *         description: No existe una categoría con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No existe una categoría con el ID proporcionado
 *       404:
 *         description: No se encontraron publicaciones con esta categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontraron publicaciones con esta categoría
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.get('/publicaciones/categoria/:id', publicacionesPorCategoria)

/**
 * @openapi
 * /api/publicaciones/{id}:
 *   patch:
 *     summary: Actualiza una publicación existente por su ID
 *     tags:
 *       - Publicaciones
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la publicación a actualizar
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título de la publicación
 *               contenido:
 *                 type: string
 *                 description: Contenido de la publicación
 *               usuario_id:
 *                 type: integer
 *                 description: ID del usuario que creó la publicación
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen de la publicación
 *               categorias:
 *                 type: string
 *                 description: Categorías de la publicación separadas por coma
 *     responses:
 *       200:
 *         description: Publicación actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Publicación actualizada correctamente
 *                 publicationEditada:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID de la publicación
 *                     titulo:
 *                       type: string
 *                       description: Título de la publicación
 *                     contenido:
 *                       type: string
 *                       description: Contenido de la publicación
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 *                       description: Fecha de creación de la publicación
 *                     usuario:
 *                       type: string
 *                       description: Nombre del usuario que creó la publicación
 *                     imagen_publicacion:
 *                       type: string
 *                       description: Nombre del archivo de la imagen de la publicación
 *       400:
 *         description: No existe ninguna publicación con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No existe ninguna publicacion con el ID proporcionado
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
 *                   example: Error interno del servidor
 */
router.patch('/publicaciones/:id', estaLogeado, propietarioPublicacion, subirArchivos.single('imagen'), actualizarPublicacion)

/**
 * @openapi
 * /api/publicaciones/{id}:
 *   delete:
 *     summary: Elimina una publicación por su ID
 *     tags:
 *       - Publicaciones
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la publicación a eliminar
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: La publicación fue eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Se eliminó la publicación correctamente
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
 *       404:
 *         description: No se encontró ninguna publicación con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró ninguna publicación con el ID proporcionado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.delete('/publicaciones/:id', estaLogeado, propietarioPublicacion, eliminarPublicacion)

export default router
