import dotenv from "dotenv";

dotenv.config();

// Debug: Verificar que las variables de mailing se carguen
// Variables de entorno para mailing configuradas correctamente

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

export const validateEnvironment = () => {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Crea un archivo .env con las variables requeridas');
    process.exit(1);
  }
  
  // Validar que JWT_SECRET tenga una longitud mínima
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET debe tener al menos 32 caracteres para mayor seguridad');
    process.exit(1);
  }
  
  console.log('✅ Variables de entorno validadas correctamente');
};

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h'
  },
  server: {
    port: process.env.PORT || 8000,
    env: process.env.NODE_ENV || 'development',
    showEndpoints: process.env.SHOW_ENDPOINTS || 'full' // full, compact, table
  },
  mailing: {
    service: process.env.MAIL_SERVICE,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true'
  },
  messaging: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromSms: process.env.TWILIO_FROM_SMS,
      fromWhatsapp: process.env.TWILIO_FROM_WHATSAPP
    }
  },
  platform: {
    url: process.env.PLATFORM_URL || 'http://localhost:8080'
  }
};
