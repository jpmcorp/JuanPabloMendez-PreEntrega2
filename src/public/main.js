const socket = io();

// // Solicitar el nombre de usuario
// let username = prompt("Ingrese su nombre de usuario");
// socket.emit("login", username);

// Notificar cuando un nuevo usuario se conecta
socket.on("new-user", (data) => alert(`${data} se ha conectado.`));

// Elementos del DOM
const chatBox = document.querySelector("#chat-box");
const inputMsg = document.querySelector("#input-msg");
const form = document.querySelector("#form");
const productList = document.querySelector("#product-list"); // Contenedor para los productos

// Enviar un nuevo mensaje
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Capturar los datos del formulario
  const code = parseInt(document.querySelector("#input-code").value, 10);
  const stock = parseInt(document.querySelector("#input-stock").value, 10);

  // Validaciones
  if (isNaN(code) || code <= 0) {
    alert("El código debe ser un número entero positivo.");
    return;
  }

  if (isNaN(stock) || stock <= 0) {
    alert("El stock debe ser un número entero positivo.");
    return;
  }

  const newProduct = {
    title: document.querySelector("#input-title").value,
    description: document.querySelector("#input-description").value,
    code,
    price: parseFloat(document.querySelector("#input-price").value),
    status: document.querySelector("#input-status").value,
    stock,
    category: document.querySelector("#input-category").value,
    thumbnail: document.querySelector("#input-thumbnail").value,
  };

  try {
    // Enviar el producto al servidor
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) throw new Error("Error al agregar el producto");

    alert("Producto agregado exitosamente!");
    form.reset(); // Limpiar el formulario
    socket.emit("new-product"); // Emitir evento para actualizar productos
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    alert("Hubo un error al agregar el producto.");
  }
});

// Mostrar productos en tiempo real
socket.on("update-products", () => {
  fetchProducts(); // Vuelve a obtener los productos cuando se actualicen
});

// Función para obtener productos desde el servidor
const fetchProducts = async () => {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Error al obtener productos");
    const products = await response.json();

    // Renderizar productos en el DOM
    let productItems = "";
    if (products.length) {
      productItems = products.reduce((acc, product) => {
        return (
          acc +
          `<div class="product-item">
            <h3>${product.title}</h3>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><strong>Precio:</strong> $${product.price}</p>
            <p><strong>Código:</strong> ${product.code}</p>
            <p><strong>ID:</strong> ${product.pid}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <button class="delete-btn" data-id="${product.pid}">Eliminar</button>
          </div>`
        );
      }, "");
    } else {
      productItems = "<p>No hay productos disponibles.</p>";
    }
    productList.innerHTML = `<div class="product-list">${productItems}</div>`;

    // Agregar eventos a los botones de eliminación
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const productId = e.target.getAttribute("data-id"); // Obtener el ID del producto
        if (productId) {
          await deleteProduct(productId);
        } else {
          console.error("El ID del producto es undefined");
        }
      });
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    productList.innerHTML = "<p>Error al cargar productos.</p>";
  }
};

// Función para eliminar un producto
const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el producto");

    alert("Producto eliminado exitosamente!");
    fetchProducts(); // Actualizar la lista de productos
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    alert("Hubo un error al eliminar el producto.");
  }
};

// Llamar a la función para obtener productos al cargar la página
fetchProducts();
