import { Router } from 'express';
import { mailerController } from '../controllers/mailer.controller.js';
import { requireAuth } from '../middleware/requireAuth.middleware.js';
import { authorizeRole } from '../middleware/authorization.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mailer
 *   description: Endpoints para envío de emails y mensajes
 */

/**
 * @swagger
 * /api/v1/mailer/welcome:
 *   post:
 *     summary: Envía email de bienvenida
 *     tags: [Mailer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email enviado exitosamente
 *       400:
 *         description: Datos faltantes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/welcome', requireAuth, authorizeRole(['admin', 'user']), mailerController.sendWelcome);

/**
 * @swagger
 * /api/v1/mailer/order-status:
 *   post:
 *     summary: Envía email de estado de orden
 *     tags: [Mailer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - customerName
 *               - code
 *               - status
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               customerName:
 *                 type: string
 *               code:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, paid, delivered, cancelled]
 *               amount:
 *                 type: number
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *               purchaseDatetime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email enviado exitosamente
 *       400:
 *         description: Datos faltantes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/order-status', requireAuth, authorizeRole(['admin']), mailerController.sendOrderStatus);

/**
 * @swagger
 * /api/v1/mailer/password-reset:
 *   post:
 *     summary: Envía email de recuperación de contraseña
 *     tags: [Mailer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - resetToken
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               resetToken:
 *                 type: string
 *               resetUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email enviado exitosamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error interno del servidor
 */
router.post('/password-reset', mailerController.sendPasswordReset);

/**
 * @swagger
 * /api/v1/mailer/purchase-confirmation:
 *   post:
 *     summary: Envía email de confirmación de compra
 *     tags: [Mailer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - customerName
 *               - code
 *               - amount
 *               - products
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               customerName:
 *                 type: string
 *               code:
 *                 type: string
 *               amount:
 *                 type: number
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *               purchaser:
 *                 type: string
 *               purchaseDatetime:
 *                 type: string
 *               orderTrackingUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email enviado exitosamente
 *       400:
 *         description: Datos faltantes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/purchase-confirmation', requireAuth, authorizeRole(['admin']), mailerController.sendPurchaseConfirmation);

/**
 * @swagger
 * /api/v1/mailer/status:
 *   get:
 *     summary: Obtiene el estado de configuración de los servicios
 *     tags: [Mailer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de los servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     mailer:
 *                       type: object
 *                       properties:
 *                         configured:
 *                           type: boolean
 *                         service:
 *                           type: string
 *                     messaging:
 *                       type: object
 *                       properties:
 *                         configured:
 *                           type: boolean
 *                         smsEnabled:
 *                           type: boolean
 *                         whatsappEnabled:
 *                           type: boolean
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/status', requireAuth, authorizeRole(['admin']), mailerController.getStatus);

export default router;