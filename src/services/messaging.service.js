import twilio from 'twilio';

export class MessagingService {
    constructor() {
        this.client = null;
        this._initialized = false;
    }

    _initializeClient() {
        if (!this._initialized) {
            const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
            this.client = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) 
                ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                : null;
            this._initialized = true;
        }
    }

    assertTwilioConfigured() {
        this._initializeClient();
        if (!this.client) {
            throw new Error('Twilio no está configurado correctamente. Verifica las variables de entorno.');
        }
    }

    formatPhoneNumber(phoneNumber) {
        // Si el número ya tiene formato internacional, lo devolvemos
        if (phoneNumber.startsWith('+')) return phoneNumber;
        // Si empieza con 549, agregamos el +
        if (phoneNumber.startsWith('549')) return '+' + phoneNumber;
        // Para otros casos, asumimos que es un número argentino sin código de país
        return '+549' + phoneNumber;
    }

    async sendSMS(to, body) {
        try {
            this.assertTwilioConfigured();
            
            const formattedNumber = this.formatPhoneNumber(to);
            
            const message = await this.client.messages.create({
                body: body,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: formattedNumber
            });

            console.log(`SMS enviado a ${formattedNumber}: ${message.sid}`);
            return {
                success: true,
                sid: message.sid,
                to: formattedNumber,
                status: message.status,
                message: 'SMS enviado exitosamente'
            };
        } catch (error) {
            console.error('Error enviando SMS:', error);
            return {
                success: false,
                error: error.message,
                to: to
            };
        }
    }

    async sendWhatsApp(to, body) {
        try {
            this.assertTwilioConfigured();
            
            const formattedNumber = this.formatPhoneNumber(to);
            const whatsappNumber = `whatsapp:${formattedNumber}`;
            
            const message = await this.client.messages.create({
                body: body,
                from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
                to: whatsappNumber
            });

            console.log(`WhatsApp enviado a ${formattedNumber}: ${message.sid}`);
            return {
                success: true,
                sid: message.sid,
                to: formattedNumber,
                status: message.status,
                message: 'WhatsApp enviado exitosamente'
            };
        } catch (error) {
            console.error('Error enviando WhatsApp:', error);
            return {
                success: false,
                error: error.message,
                to: to
            };
        }
    }

    isConfigured() {
        this._initializeClient();
        return this.client !== null;
    }

    async sendPurchaseNotification(phoneNumber, orderCode, total, customerName) {
        // Mensaje ultra-corto para cuentas Trial de Twilio (máximo 160 caracteres)
        const message = `Compra OK! ${orderCode} $${total.toFixed(2)}. Gracias!`;
        
        return this.sendSMS(phoneNumber, message);
    }

    async sendOrderStatusNotification(phoneNumber, orderCode, status, customerName) {
        let statusMessage;
        let emoji;

        switch (status.toLowerCase()) {
            case 'preparando':
                emoji = '👨‍🍳';
                statusMessage = 'está siendo preparado';
                break;
            case 'enviado':
                emoji = '🚚';
                statusMessage = 'ha sido enviado';
                break;
            case 'entregado':
                emoji = '✅';
                statusMessage = 'ha sido entregado';
                break;
            case 'cancelado':
                emoji = '❌';
                statusMessage = 'ha sido cancelado';
                break;
            default:
                emoji = '📦';
                statusMessage = `está en estado: ${status}`;
        }

        const message = `${emoji} Hola ${customerName}! Tu pedido ${orderCode} ${statusMessage}.\n\n` +
                       `Si tienes alguna pregunta, no dudes en contactarnos.`;
        
        return this.sendSMS(phoneNumber, message);
    }

    getStatus() {
        return {
            configured: this.isConfigured(),
            twilioAccount: process.env.TWILIO_ACCOUNT_SID ? 'Configurado' : 'No configurado',
            phoneNumber: process.env.TWILIO_PHONE_NUMBER || 'No configurado',
            whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || 'No configurado'
        };
    }
}

export const messagingService = new MessagingService();
