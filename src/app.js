import http from "http";
import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import websockets from "./websockets.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8000;
const app = express();

dotenv.config();
// Conexión a la base de datos MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a la base de datos Mongo Atlas"))
  .catch((err) =>
    console.log("No se pudo conectar a la base de datos Mongo Atlas: " + err)
  );

const httpServer = http.createServer(app);
const io = new Server(httpServer);
websockets(io);

app.set("io", io); // <-- Agrega esta línea

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "/public")));
app.use("/", viewsRouter);

app.use("/api", productsRouter);
app.use("/api", cartsRouter);

httpServer.listen(PORT, () =>
  console.log("Servidor levantado en puerto: " + PORT)
);
