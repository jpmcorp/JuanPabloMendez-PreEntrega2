import twilio from 'twilio';

// Variables de entorno para Twilio
const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_SMS,
    TWILIO_FROM_WHATSAPP
} = process.env;

// Cliente de Twilio inicializado solo si las credenciales están disponibles
const client = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) 
    ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    : null;

/**
 * Servicio de mensajería con Twilio (SMS y WhatsApp)
 */
export class MessagingService {
    #client;

    constructor(twilioClient = client) {
        this.#client = twilioClient;
    }

    /**
     * Verifica que Twilio esté configurado
     * @private
     */
    #assertTwilioConfigured() {
        if (!this.#client) {
            throw new Error("Twilio no está configurado. Revisa las variables de entorno TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN");
        }
    }

    /**
     * Formatea un número de teléfono para Twilio
     * @param {string} phoneNumber - Número de teléfono
     * @returns {string} Número formateado
     * @private
     */
    #formatPhoneNumber(phoneNumber) {
        // Asegurar que el número tenga el formato +[código país][número]
        if (!phoneNumber.startsWith('+')) {
            // Si no tiene código de país, asumir Argentina (+54)
            return `+54${phoneNumber}`;
        }
        return phoneNumber;
    }

    /**
     * Envía un SMS
     * @param {object} options - Opciones del SMS
     * @param {string} options.to - Número de teléfono destinatario
     * @param {string} options.body - Contenido del mensaje
     * @returns {Promise<object>} Resultado del envío
     */
    async sendSMS({ to, body }) {
        this.#assertTwilioConfigured();
        
        if (!to || !body) {
            throw new Error("Faltan campos requeridos: to y body");
        }
        
        if (!TWILIO_FROM_SMS) {
            throw new Error("TWILIO_FROM_SMS no está configurado en las variables de entorno");
        }

        const formattedTo = this.#formatPhoneNumber(to);
        
        const message = await this.#client.messages.create({
            from: TWILIO_FROM_SMS,
            to: formattedTo,
            body
        });

        return {
            sid: message.sid,
            status: message.status,
            to: formattedTo,
            body
        };
    }

    /**
     * Envía un mensaje de WhatsApp
     * @param {object} options - Opciones del mensaje
     * @param {string} options.to - Número de WhatsApp destinatario
     * @param {string} options.body - Contenido del mensaje
     * @returns {Promise<object>} Resultado del envío
     */
    async sendWhatsApp({ to, body }) {
        this.#assertTwilioConfigured();
        
        if (!to || !body) {
            throw new Error("Faltan campos requeridos: to y body");
        }
        
        if (!TWILIO_FROM_WHATSAPP) {
            throw new Error("TWILIO_FROM_WHATSAPP no está configurado en las variables de entorno");
        }

        const formattedTo = `whatsapp:${this.#formatPhoneNumber(to)}`;
        
        const message = await this.#client.messages.create({
            from: TWILIO_FROM_WHATSAPP,
            to: formattedTo,
            body
        });

        return {
            sid: message.sid,
            status: message.status,
            to: formattedTo,
            body
        };
    }

    /**
     * Envía notificación de orden creada por SMS
     * @param {string} phoneNumber - Número de teléfono
     * @param {string} orderCode - Código de la orden
     * @param {number} total - Total de la orden
     * @returns {Promise<object>} Resultado del envío
     */
    async sendOrderNotification(phoneNumber, orderCode, total) {
        const body = `¡Tu orden ${orderCode} ha sido creada exitosamente! Total: $${total}. Gracias por tu compra.`;
        
        return this.sendSMS({
            to: phoneNumber,
            body
        });
    }

    /**
     * Envía notificación de cambio de estado de orden
     * @param {string} phoneNumber - Número de teléfono
     * @param {string} orderCode - Código de la orden
     * @param {string} status - Nuevo estado
     * @returns {Promise<object>} Resultado del envío
     */
    async sendOrderStatusUpdate(phoneNumber, orderCode, status) {
        const statusMessages = {
            pending: 'está pendiente de pago',
            paid: 'ha sido pagada exitosamente',
            delivered: 'ha sido entregada',
            cancelled: 'ha sido cancelada'
        };

        const body = `Tu orden ${orderCode} ${statusMessages[status] || status}. Gracias por elegirnos.`;
        
        return this.sendSMS({
            to: phoneNumber,
            body
        });
    }

    /**
     * Envía código de verificación por SMS
     * @param {string} phoneNumber - Número de teléfono
     * @param {string} code - Código de verificación
     * @returns {Promise<object>} Resultado del envío
     */
    async sendVerificationCode(phoneNumber, code) {
        const body = `Tu código de verificación es: ${code}. Este código expira en 10 minutos.`;
        
        return this.sendSMS({
            to: phoneNumber,
            body
        });
    }

    /**
     * Verifica si Twilio está configurado
     * @returns {boolean} True si está configurado
     */
    isConfigured() {
        return this.#client !== null;
    }

    /**
     * Obtiene información de configuración
     * @returns {object} Estado de la configuración
     */
    getStatus() {
        return {
            configured: this.isConfigured(),
            smsEnabled: !!TWILIO_FROM_SMS,
            whatsappEnabled: !!TWILIO_FROM_WHATSAPP
        };
    }
}

export const messagingService = new MessagingService();