const socket = io();

// Elementos del DOM
const chatBox = document.querySelector("#chat-box");
const inputMsg = document.querySelector("#input-msg");
const form = document.querySelector("#form");
const productList = document.querySelector("#product-list");
const pagination = document.createElement("div");
pagination.id = "pagination";
productList.after(pagination);

let currentPage = 1;
const limit = 15;

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
  fetchProducts(currentPage);
});

// Función para obtener productos desde el servidor
const fetchProducts = async (page = 1) => {
  try {
    const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error("Error al obtener productos");
    const data = await response.json();
    const products = data.payload;

    // Renderizar productos en el DOM
    let productItems = "";
    if (products && products.length) {
      productItems = products.reduce((acc, product) => {
        return (
          acc +
          `<div class="product-item">
            <img src="/iphone.jpg" alt="Imagen producto" style="width:100px;max-width:100px;border-radius:6px;margin-bottom:8px;">
            <h3>${product.title}</h3>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>Precio:</strong> $${product.price}</p>
            <p><strong>Código:</strong> ${product.code}</p>
            <p><strong>ID:</strong> ${product.pid}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <button class="delete-btn" data-id="${product.pid}">Eliminar Producto</button>
            <button class="add-cart-btn" data-id="${product.pid}">Agregar al carrito</button>
          </div>`
        );
      }, "");
    } else {
      productItems = "<p>No hay productos disponibles.</p>";
    }
    productList.innerHTML = `<div class="product-list">${productItems}</div>`;

    // Paginación
    renderPagination(data);

    // Agregar eventos a los botones de eliminación
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const productId = e.target.getAttribute("data-id");
        if (productId) {
          await deleteProduct(productId);
        } else {
          console.error("El ID del producto es undefined");
        }
      });
    });

    // Después de renderizar los productos, agrega la lógica para el botón "Agregar al carrito"
    document.querySelectorAll(".add-cart-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const productId = e.target.getAttribute("data-id");
        try {
          const response = await fetch(`/api/carts/1/products/${productId}`, {
            method: "POST",
          });
          if (!response.ok) throw new Error("No se pudo agregar al carrito");
          alert("Producto agregado al carrito 1");
        } catch (error) {
          alert("Error al agregar al carrito");
        }
      });
    });

    currentPage = data.page;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    productList.innerHTML = "<p>Error al cargar productos.</p>";
  }
};

function renderPagination(data) {
  let html = "";
  if (data.hasPrevPage) {
    html += `<button id="prev-page">Anterior</button>`;
  }
  html += `<span> Página ${data.page} de ${data.totalPages} </span>`;
  if (data.hasNextPage) {
    html += `<button id="next-page">Siguiente</button>`;
  }
  pagination.innerHTML = html;

  if (data.hasPrevPage) {
    document.getElementById("prev-page").onclick = () =>
      fetchProducts(data.prevPage);
  }
  if (data.hasNextPage) {
    document.getElementById("next-page").onclick = () =>
      fetchProducts(data.nextPage);
  }
}

// Función para eliminar un producto
const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el producto");

    alert("Producto eliminado exitosamente!");
    fetchProducts(currentPage); // Actualizar la lista de productos
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    alert("Hubo un error al eliminar el producto.");
  }
};

// Llamar a la función para obtener productos al cargar la página
fetchProducts();

// Crear y agregar el botón "Ver Carrito" arriba a la derecha
const verCarritoBtn = document.createElement("button");
verCarritoBtn.textContent = "Ver Carrito";
verCarritoBtn.className = "ver-carrito-btn";
verCarritoBtn.onclick = () => {
  window.location.href = "/cartView";
};
document.body.appendChild(verCarritoBtn);
