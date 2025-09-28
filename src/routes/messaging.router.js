import { Router } from 'express';
import { mailerController } from '../controllers/mailer.controller.js';
import { requireAuth } from '../middleware/requireAuth.middleware.js';
import { authorizeRole } from '../middleware/authorization.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Messaging
 *   description: Endpoints para envío de SMS y WhatsApp
 */

/**
 * @swagger
 * /api/v1/messaging/sms:
 *   post:
 *     summary: Envía mensaje SMS
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - body
 *             properties:
 *               to:
 *                 type: string
 *                 description: Número de teléfono destinatario
 *               body:
 *                 type: string
 *                 description: Contenido del mensaje
 *     responses:
 *       200:
 *         description: SMS enviado exitosamente
 *       400:
 *         description: Datos faltantes
 *       401:
 *         description: No autorizado
 *       503:
 *         description: Servicio no configurado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/sms', requireAuth, authorizeRole(['admin']), mailerController.sendSMS);

/**
 * @swagger
 * /api/v1/messaging/whatsapp:
 *   post:
 *     summary: Envía mensaje de WhatsApp
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - body
 *             properties:
 *               to:
 *                 type: string
 *                 description: Número de WhatsApp destinatario
 *               body:
 *                 type: string
 *                 description: Contenido del mensaje
 *     responses:
 *       200:
 *         description: WhatsApp enviado exitosamente
 *       400:
 *         description: Datos faltantes
 *       401:
 *         description: No autorizado
 *       503:
 *         description: Servicio no configurado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/whatsapp', requireAuth, authorizeRole(['admin']), mailerController.sendWhatsApp);

/**
 * @swagger
 * /api/v1/messaging/order-notification:
 *   post:
 *     summary: Envía notificación de orden por SMS
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - orderCode
 *               - total
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Número de teléfono del cliente
 *               orderCode:
 *                 type: string
 *                 description: Código de la orden
 *               total:
 *                 type: number
 *                 description: Total de la orden
 *     responses:
 *       200:
 *         description: Notificación enviada exitosamente
 *       400:
 *         description: Datos faltantes
 *       401:
 *         description: No autorizado
 *       503:
 *         description: Servicio no configurado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/order-notification', requireAuth, authorizeRole(['admin']), mailerController.sendOrderNotification);

export default router;