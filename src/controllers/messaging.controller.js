import { messagingService } from '../services/messaging.service.js';

/**
 * Controlador para el servicio de mensajería (SMS y WhatsApp)
 */
export const messagingController = {
    /**
     * Obtiene el status del servicio de mensajería
     */
    getStatus(req, res) {
        try {
            const status = messagingService.getStatus();
            res.status(200).json({
                status: 'success',
                message: 'Servicio de mensajería disponible',
                data: status
            });
        } catch (error) {
            console.error('Error al obtener status de mensajería:', error.message);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    /**
     * Envía un SMS
     */
    async sendSMS(req, res) {
        try {
            const { phoneNumber, message } = req.body;

            if (!phoneNumber || !message) {
                return res.status(400).json({
                    status: 'error',
                    message: 'phoneNumber y message son requeridos'
                });
            }

            const result = await messagingService.sendSMS(phoneNumber, message);
            
            res.status(200).json({
                status: 'success',
                message: 'SMS enviado exitosamente',
                data: {
                    sid: result.sid,
                    to: result.to,
                    status: result.status
                }
            });
        } catch (error) {
            console.error('Error enviando SMS:', error.message);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    /**
     * Envía un mensaje de WhatsApp
     */
    async sendWhatsApp(req, res) {
        try {
            const { phoneNumber, message } = req.body;

            if (!phoneNumber || !message) {
                return res.status(400).json({
                    status: 'error',
                    message: 'phoneNumber y message son requeridos'
                });
            }

            const result = await messagingService.sendWhatsApp(phoneNumber, message);
            
            res.status(200).json({
                status: 'success',
                message: 'Mensaje de WhatsApp enviado exitosamente',
                data: {
                    sid: result.sid,
                    to: result.to,
                    status: result.status
                }
            });
        } catch (error) {
            console.error('Error enviando WhatsApp:', error.message);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    /**
     * Envía notificación de compra
     */
    async sendPurchaseNotification(req, res) {
        try {
            const { phoneNumber, orderCode, total, customerName } = req.body;

            if (!phoneNumber || !orderCode || !total || !customerName) {
                return res.status(400).json({
                    status: 'error',
                    message: 'phoneNumber, orderCode, total y customerName son requeridos'
                });
            }

            const result = await messagingService.sendPurchaseNotification(
                phoneNumber, 
                orderCode, 
                total, 
                customerName
            );
            
            res.status(200).json({
                status: 'success',
                message: 'Notificación de compra enviada exitosamente',
                data: {
                    sid: result.sid,
                    to: result.to,
                    status: result.status
                }
            });
        } catch (error) {
            console.error('Error enviando notificación de compra:', error.message);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    /**
     * Envía notificación de cambio de estado de orden
     */
    async sendOrderStatusNotification(req, res) {
        try {
            const { phoneNumber, orderCode, status, customerName } = req.body;

            if (!phoneNumber || !orderCode || !status || !customerName) {
                return res.status(400).json({
                    status: 'error',
                    message: 'phoneNumber, orderCode, status y customerName son requeridos'
                });
            }

            const result = await messagingService.sendOrderStatusNotification(
                phoneNumber, 
                orderCode, 
                status, 
                customerName
            );
            
            res.status(200).json({
                status: 'success',
                message: 'Notificación de estado enviada exitosamente',
                data: {
                    sid: result.sid,
                    to: result.to,
                    status: result.status
                }
            });
        } catch (error) {
            console.error('Error enviando notificación de estado:', error.message);
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};