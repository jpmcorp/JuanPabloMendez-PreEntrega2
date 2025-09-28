import http from "http";
import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import ordersRouter from "./routes/orders.router.js";
import mailerRouter from "./routes/mailer.router.js";
import messagingRouter from "./routes/messaging.router.js";
import { Server } from "socket.io";
import websockets from "./websockets.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { validateEnvironment, config } from "./config/environment.config.js";
import logger from "./middleware/logger.middleware.js";
import { showEndpoints, showEndpointsTable } from "./utils/endpoints.util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validar variables de entorno antes de continuar
validateEnvironment();

const PORT = config.server.port;
const app = express();

initializePassport();
// Conexión a la base de datos MongoDB Atlas
mongoose
  .connect(config.mongodb.uri)
  .then(() => console.log("✅ Conectado a la base de datos MongoDB Atlas"))
  .catch((err) =>
    console.log("❌ No se pudo conectar a la base de datos MongoDB Atlas: " + err)
  );

const httpServer = http.createServer(app);
const io = new Server(httpServer);
websockets(io);

app.set("io", io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "/public")));
app.use("/", viewsRouter);

app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api", ordersRouter);
app.use("/api/v1/mailer", mailerRouter);
app.use("/api/v1/messaging", messagingRouter);

httpServer.listen(PORT, () => {
  console.log(`✅ Servidor levantado en puerto: ${PORT}`);
  
  // Mostrar endpoints según configuración
  switch(config.server.showEndpoints) {
    case 'compact':
      showEndpoints(true);
      break;
    case 'table':
      showEndpointsTable();
      break;
    case 'full':
    default:
      showEndpoints();
      break;
  }
});
