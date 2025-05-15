const messages = [];
const products = [];

export default (io) => {
  io.on("connection", (socket) => {
    console.log("Un nuevo cliente se ha conectado");
    console.log("ID del cliente: ", socket.id);

    // Emitir mensajes iniciales
    socket.emit("all-msgs", messages);

    // Escuchar nuevos mensajes
    socket.on("new-msg", (data) => {
      messages.unshift(data);
      io.emit("all-msgs", messages);
    });

    // Escuchar inicio de sesión
    socket.on("login", (data) => {
      socket.broadcast.emit("new-user", data);
    });

    console.log("Nuevo cliente conectado");

    // Emitir productos iniciales
    socket.emit("update-products", products);

    // Escuchar cuando se agregue un nuevo producto
    socket.on("new-product", (product) => {
      products.push(product); // Agregar el producto a la lista
      io.emit("update-products", products); // Enviar la lista actualizada a todos los clientes
    });

    // Escuchar cuando se actualice un producto
    socket.on("update-product", (updatedProduct) => {
      const index = products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        products[index] = updatedProduct; // Actualizar el producto en la lista
        io.emit("update-products", products); // Enviar la lista actualizada a todos los clientes
      }
    });
  });
};
