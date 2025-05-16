const cartForm = document.createElement("form");
cartForm.id = "cart-form";
cartForm.innerHTML = `
  <label for="input-cid">ID del carrito:</label>
  <input type="number" id="input-cid" min="1" required>
  <button type="submit">Ver carrito</button>
`;
document.body.prepend(cartForm);

const cartContent = document.createElement("div");
cartContent.id = "cart-content";
cartContent.style.marginTop = "30px";
document.body.appendChild(cartContent);

cartForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cid = document.getElementById("input-cid").value;
  if (!cid) return alert("Ingrese un ID de carrito válido.");

  try {
    const response = await fetch(`/api/carts/${cid}`);
    if (!response.ok) throw new Error("Carrito no encontrado");
    const cart = await response.json();

    if (!cart.products || cart.products.length === 0) {
      cartContent.innerHTML = "<p>El carrito está vacío.</p>";
      return;
    }

    let html = `<h2>Carrito #${cart.cid}</h2>`;
    html += `<div class="cart-products">`;
    cart.products.forEach((item) => {
      const prod = item._id; // Producto populado
      html += `
        <div class="product-item" style="margin-bottom:16px;">
          <img src="/iphone.jpg" alt="${prod.title}" style="width:100px;max-width:100px;display:block;margin:auto;border-radius:6px;margin-bottom:8px;">
          <h3>${prod.title}</h3>
          <p><strong>Descripción:</strong> ${prod.description}</p>
          <p><strong>Categoría:</strong> ${prod.category}</p>
          <p><strong>Precio:</strong> $${prod.price}</p>
          <p><strong>Código:</strong> ${prod.code}</p>
          <p><strong>ID Producto:</strong> ${prod.pid}</p>
          <p><strong>Cantidad en carrito:</strong> ${item.quantity}</p>
          <button class="remove-cart-btn" data-pid="${prod.pid}">Eliminar del carrito</button>
        </div>
      `;
    });
    html += `</div>`;
    cartContent.innerHTML = html;

    // Agregar lógica para eliminar producto del carrito
    document.querySelectorAll(".remove-cart-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const pid = e.target.getAttribute("data-pid");
        try {
          const response = await fetch(`/api/carts/${cart.cid}/products/${pid}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("No se pudo eliminar el producto del carrito");
          alert("Producto eliminado del carrito");
          cartForm.dispatchEvent(new Event("submit")); // Recargar el carrito
        } catch (error) {
          alert("Error al eliminar el producto del carrito");
        }
      });
    });
  } catch (error) {
    cartContent.innerHTML = `<p style="color:red;">No se pudo obtener el carrito: ${error.message}</p>`;
  }
});