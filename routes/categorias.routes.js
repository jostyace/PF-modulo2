import express from 'express'
import {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/categorias.controller.js'
import { esAdmin } from '../utils/validation.js'

const router = express.Router()

/**
 * @openapi
 * /api/categorias:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags:
 *       - Categorías
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría creada satisfactoriamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría creada satisfactoriamente
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
 */
router.post('/categorias', esAdmin, crearCategoria)

/**
 * @openapi
 * /api/categorias:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags:
 *       - Categorías
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
 *                   nombre_categoria:
 *                     type: string
 *                     example: "Nombre de la categoría"
 *                   otro_campo:
 *                     type: string
 *                     example: "Valor"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró ninguna categoría
 */
router.get('/categorias', obtenerCategorias)

/**
 * @openapi
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtiene una categoría por su ID
 *     tags:
 *       - Categorías
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a obtener
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
 *                   nombre_categoria:
 *                     type: string
 *                     example: "Nombre de la categoría"
 *                   otro_campo:
 *                     type: string
 *                     example: "Valor"
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
router.get('/categorias/:id', obtenerCategoriaPorId)

/**
 * @openapi
 * /api/categorias/{id}:
 *   patch:
 *     summary: Actualiza una categoría por su ID
 *     tags:
 *       - Categorías
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a actualizar
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
 *               nombre_categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría actualizada correctamente
 *       404:
 *         description: No se encontró ninguna categoría con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró ninguna categoría con el ID proporcionado
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
router.patch('/categorias/:id', esAdmin, actualizarCategoria)

/**
 * @openapi
 * /api/categorias/{id}:
 *   delete:
 *     summary: Elimina una categoría por su ID
 *     tags:
 *       - Categorías
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a eliminar
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Se eliminó la categoría correctamente
 *       404:
 *         description: No se encontró ninguna categoría con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró ninguna categoría con el ID proporcionado
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
router.delete('/categorias/:id', esAdmin, eliminarCategoria)

export default router
