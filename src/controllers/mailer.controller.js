import { mailerService } from '../services/mailer.service.js';
import { messagingService } from '../services/messaging.service.js';

/**
 * Controlador para manejo de emails y mensajería
 */
export class MailerController {

    /**
     * Envía email de bienvenida a un nuevo usuario
     * POST /api/v1/mailer/welcome
     */
    async sendWelcome(req, res) {
        try {
            const { email, firstName, lastName } = req.body;

            if (!email || !firstName) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email y firstName son requeridos'
                });
            }

            // Enviar email de bienvenida
            const result = await mailerService.sendWelcome({
                to: email,
                firstName,
                lastName,
                platformUrl: process.env.PLATFORM_URL || 'http://localhost:8080'
            });

            res.status(200).json({
                status: 'success',
                message: 'Email de bienvenida enviado exitosamente',
                data: {
                    messageId: result.messageId,
                    to: email
                }
            });

        } catch (error) {
            console.error('Error enviando email de bienvenida:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al enviar email',
                error: error.message
            });
        }
    }

    /**
     * Envía email de estado de orden
     * POST /api/v1/mailer/order-status
     */
    async sendOrderStatus(req, res) {
        try {
            const { 
                email, 
                customerName, 
                code, 
                status, 
                amount, 
                products,
                purchaseDatetime 
            } = req.body;

            if (!email || !customerName || !code || !status) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email, customerName, code y status son requeridos'
                });
            }

            // Enviar email de estado de orden
            const result = await mailerService.sendOrderStatus({
                to: email,
                customerName,
                code,
                status,
                amount,
                products: products || [],
                purchaseDatetime: purchaseDatetime || new Date().toLocaleString('es-AR')
            });

            res.status(200).json({
                status: 'success',
                message: 'Email de estado de orden enviado exitosamente',
                data: {
                    messageId: result.messageId,
                    to: email,
                    orderCode: code
                }
            });

        } catch (error) {
            console.error('Error enviando email de estado de orden:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al enviar email',
                error: error.message
            });
        }
    }

    /**
     * Envía email de recuperación de contraseña
     * POST /api/v1/mailer/password-reset
     */
    async sendPasswordReset(req, res) {
        try {
            const { email, firstName, resetToken, resetUrl } = req.body;

            if (!email || !firstName || !resetToken) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email, firstName y resetToken son requeridos'
                });
            }

            // Enviar email de recuperación de contraseña
            const result = await mailerService.sendPasswordReset(
                email,
                firstName,
                resetToken,
                resetUrl
            );

            res.status(200).json({
                status: 'success',
                message: 'Email de recuperación de contraseña enviado exitosamente',
                data: {
                    messageId: result.messageId,
                    to: email
                }
            });

        } catch (error) {
            console.error('Error enviando email de recuperación:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al enviar email',
                error: error.message
            });
        }
    }

    /**
     * Envía email de confirmación de compra
     * POST /api/v1/mailer/purchase-confirmation
     */
    async sendPurchaseConfirmation(req, res) {
        try {
            const { 
                email, 
                customerName, 
                code, 
                amount, 
                products,
                purchaser,
                purchaseDatetime,
                orderTrackingUrl 
            } = req.body;

            if (!email || !customerName || !code || !amount || !products) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email, customerName, code, amount y products son requeridos'
                });
            }

            // Enviar email de confirmación de compra
            const result = await mailerService.sendPurchaseConfirmation({
                to: email,
                customerName,
                code,
                amount,
                products,
                purchaser: purchaser || email,
                purchaseDatetime: purchaseDatetime || new Date().toLocaleString('es-AR'),
                orderTrackingUrl
            });

            res.status(200).json({
                status: 'success',
                message: 'Email de confirmación de compra enviado exitosamente',
                data: {
                    messageId: result.messageId,
                    to: email,
                    orderCode: code
                }
            });

        } catch (error) {
            console.error('Error enviando email de confirmación de compra:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al enviar email',
                error: error.message
            });
        }
    }

    /**
     * Envía SMS
     * POST /api/v1/messaging/sms
     */
    async sendSMS(req, res) {
        try {
            const { to, body } = req.body;

            if (!to || !body) {
                return res.status(400).json({
                    status: 'error',
                    message: 'to y body son requeridos'
                });
            }

            if (!messagingService.isConfigured()) {
                return res.status(503).json({
                    status: 'error',
                    message: 'Servicio de mensajería no configurado. Revisa las variables de entorno de Twilio.'
                });
            }

            // Enviar SMS
            const result = await messagingService.sendSMS({ to, body });

            res.status(200).json({
                status: 'success',
                message: 'SMS enviado exitosamente',
                data: result
            });

        } catch (error) {
            console.error('Error enviando SMS:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al enviar SMS',
                error: error.message
            });
        }
    }

    /**
     * Envía mensaje de WhatsApp
     * POST /api/v1/messaging/whatsapp
     */
    async sendWhatsApp(req, res) {
        try {
            const { to, body } = req.body;

            if (!to || !body) {
                return res.status(400).json({
                    status: 'error',
                    message: 'to y body son requeridos'
                });
            }

            if (!messagingService.isConfigured()) {
                return res.status(503).json({
                    status: 'error',
                    message: 'Servicio de mensajería no configurado. Revisa las variables de entorno de Twilio.'
                });
            }

            // Enviar WhatsApp
            const result = await messagingService.sendWhatsApp({ to, body });

            res.status(200).json({
                status: 'success',
                message: 'Mensaje de WhatsApp enviado exitosamente',
                data: result
            });

        } catch (error) {
            console.error('Error enviando WhatsApp:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al enviar WhatsApp',
                error: error.message
            });
        }
    }

    /**
     * Obtiene el estado de configuración de los servicios
     * GET /api/v1/mailer/status
     */
    async getStatus(req, res) {
        try {
            const mailerStatus = mailerService.isConfigured();
            const messagingStatus = messagingService.getStatus();

            res.status(200).json({
                status: 'success',
                data: {
                    mailer: {
                        configured: mailerStatus,
                        service: process.env.MAIL_SERVICE || 'Not configured'
                    },
                    messaging: messagingStatus
                }
            });

        } catch (error) {
            console.error('Error obteniendo estado:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    /**
     * Envía notificación de orden por SMS
     * POST /api/v1/messaging/order-notification
     */
    async sendOrderNotification(req, res) {
        try {
            const { phoneNumber, orderCode, total } = req.body;

            if (!phoneNumber || !orderCode || !total) {
                return res.status(400).json({
                    status: 'error',
                    message: 'phoneNumber, orderCode y total son requeridos'
                });
            }

            if (!messagingService.isConfigured()) {
                return res.status(503).json({
                    status: 'error',
                    message: 'Servicio de mensajería no configurado'
                });
            }

            // Enviar notificación de orden
            const result = await messagingService.sendOrderNotification(phoneNumber, orderCode, total);

            res.status(200).json({
                status: 'success',
                message: 'Notificación de orden enviada exitosamente',
                data: result
            });

        } catch (error) {
            console.error('Error enviando notificación de orden:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor al enviar notificación',
                error: error.message
            });
        }
    }
}

export const mailerController = new MailerController();