import { Router } from 'express';
import { messagingController } from '../controllers/messaging.controller.js';
import { requireAuth } from '../middleware/requireAuth.middleware.js';
import { authorizeRole } from '../middleware/authorization.middleware.js';

const router = Router();

// GET /status - Estado del servicio (sin autenticación)
router.get('/status', messagingController.getStatus);

// POST /sms - Enviar SMS (con autenticación)
router.post('/sms', requireAuth, messagingController.sendSMS);

// POST /whatsapp - Enviar WhatsApp (con autenticación)
router.post('/whatsapp', requireAuth, messagingController.sendWhatsApp);

// POST /purchase-notification - Notificación de compra (con autenticación)
router.post('/purchase-notification', requireAuth, messagingController.sendPurchaseNotification);

// POST /order-status - Notificación de estado (admin)
router.post('/order-status', requireAuth, authorizeRole(['admin']), messagingController.sendOrderStatusNotification);

export default router;
