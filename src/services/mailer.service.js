import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Registrar helpers de Handlebars para las plantillas
Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('ne', (a, b) => a !== b);
Handlebars.registerHelper('gt', (a, b) => a > b);
Handlebars.registerHelper('lt', (a, b) => a < b);
Handlebars.registerHelper('multiply', (a, b) => a * b);
Handlebars.registerHelper('add', (a, b) => a + b);
Handlebars.registerHelper('subtract', (a, b) => a - b);

// Variables de entorno para email
// No desestructuramos al inicio, usamos process.env directamente

/**
 * Construye el transporte de nodemailer
 * @returns {nodemailer.Transporter} Transporte configurado
 */
function buildTransport() {
    // Configuración de transporte de email
    
    // Opción 1: Usar servicio predefinido (Gmail, Outlook, etc.)
    if (process.env.MAIL_SERVICE && process.env.MAIL_USER && process.env.MAIL_PASSWORD) {
        return nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }
    
    // Opción 2: Usar configuración SMTP manual
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: String(process.env.SMTP_SECURE || "false") === "true",
            auth: { 
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS 
            },
        });
    }
    
    throw new Error("No hay configuración de email disponible. Configure MAIL_SERVICE o SMTP_HOST en las variables de entorno");
}

/**
 * Renderiza una plantilla de email con Handlebars
 * @param {string} templateName - Nombre de la plantilla
 * @param {object} data - Datos para la plantilla
 * @returns {Promise<string>} HTML renderizado
 */
async function renderTemplate(templateName, data) {
    const viewDir = path.join(__dirname, "../views/emails");
    const filePath = path.join(viewDir, `${templateName}.handlebars`);
    
    try {
        const source = await fs.readFile(filePath, "utf-8");
        const template = Handlebars.compile(source);
        return template(data || {});
    } catch (error) {
        throw new Error(`Error al cargar plantilla ${templateName}: ${error.message}`);
    }
}

/**
 * Servicio de envío de emails
 */
export class MailerService {
    /**
     * Envía un email usando plantilla
     * @param {object} options - Opciones del email
     * @param {string} options.to - Destinatario
     * @param {string} options.subject - Asunto
     * @param {string} options.template - Nombre de la plantilla
     * @param {object} options.context - Datos para la plantilla
     * @returns {Promise<object>} Resultado del envío
     */
    async send({ to, subject, template, context = {} }) {
        if (!to || !subject || !template) {
            throw new Error("Faltan campos requeridos: to, subject, template");
        }

        const transport = buildTransport();
        const html = await renderTemplate(template, context);
        
        const info = await transport.sendMail({
            from: process.env.MAIL_FROM || process.env.SMTP_FROM || process.env.MAIL_USER || process.env.SMTP_USER,
            to,
            subject,
            html,
        });

        return { 
            messageId: info.messageId, 
            accepted: info.accepted, 
            rejected: info.rejected 
        };
    }

    /**
     * Envía email de bienvenida
     * @param {string} to - Email destinatario
     * @param {string} name - Nombre del usuario
     * @returns {Promise<object>} Resultado del envío
     */
    async sendWelcome(to, name) {
        return this.send({
            to,
            subject: `¡Bienvenido/a ${name}!`,
            template: 'welcome',
            context: { name }
        });
    }

    /**
     * Envía email de estado de orden
     * @param {string} to - Email destinatario
     * @param {string} orderCode - Código de la orden
     * @param {string} status - Estado de la orden
     * @param {object} order - Objeto completo de la orden
     * @returns {Promise<object>} Resultado del envío
     */
    async sendOrderStatus(to, orderCode, status, order = {}) {
        const statusMessages = {
            pending: 'Pendiente de pago',
            paid: 'Pagada exitosamente',
            delivered: 'Entregada',
            cancelled: 'Cancelada'
        };

        return this.send({
            to,
            subject: `Actualización de tu orden ${orderCode}`,
            template: 'order-status',
            context: { 
                code: orderCode, 
                status: statusMessages[status] || status,
                order
            }
        });
    }

    /**
     * Envía email de recuperación de contraseña
     * @param {string} to - Email destinatario
     * @param {string} name - Nombre del usuario
     * @param {string} resetToken - Token para resetear contraseña
     * @param {string} resetUrl - URL para resetear contraseña
     * @returns {Promise<object>} Resultado del envío
     */
    async sendPasswordReset(to, name, resetToken, resetUrl) {
        return this.send({
            to,
            subject: 'Recuperación de contraseña',
            template: 'password-reset',
            context: { 
                name, 
                resetToken, 
                resetUrl,
                expiresIn: '1 hora'
            }
        });
    }

    /**
     * Envía email de confirmación de compra
     * @param {string} to - Email destinatario
     * @param {object} order - Objeto de la orden
     * @returns {Promise<object>} Resultado del envío
     */
    async sendPurchaseConfirmation(to, order) {
        return this.send({
            to,
            subject: `Confirmación de compra - Orden ${order.code}`,
            template: 'purchase-confirmation',
            context: { order }
        });
    }

    /**
     * Verifica si el servicio de mailing está configurado
     * @returns {boolean} True si está configurado
     */
    isConfigured() {
        return !!(MAIL_SERVICE && MAIL_USER && MAIL_PASSWORD) ||
               !!(SMTP_HOST && SMTP_PORT && MAIL_USER && MAIL_PASSWORD);
    }
}

export const mailerService = new MailerService();