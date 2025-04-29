const messages = [];
const products = [];

export default (io) => {
  io.on("connection", (socket) => {
    console.log("Un nuevo cliente se ha conectado");
    console.log("ID del cliente: ", socket.id);

    socket.emit("all-msgs", messages);

    socket.on("new-msg", (data) => {
      messages.unshift(data);
      io.emit("all-msgs", messages);
    });

    socket.on("login", (data) => {
      socket.broadcast.emit("new-user", data);
    });
  });

  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    // Enviar productos iniciales
    socket.emit("update-products", products);

    // Escuchar cuando se agregue un nuevo producto
    socket.on("new-product", (product) => {
      products.push(product); // Agregar el producto a la lista
      io.emit("update-products", products); // Enviar la lista actualizada a todos los clientes
    });
  });
};
