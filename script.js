document.addEventListener("DOMContentLoaded", () => {
  const menuGrid = document.getElementById("menu-grid");
  const filterButtons = document.querySelectorAll(".btn-filter");
  const cartBtn = document.getElementById("cart-btn");
  const cartModal = document.getElementById("cart-modal");
  const closeBtn = document.querySelector(".close-btn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const whatsappSendBtn = document.getElementById("whatsapp-send-btn");

  let menuData = [];
  let cart = [];

  // 1. Cargar el JSON
  fetch("assets/menu.json")
    .then(res => res.json())
    .then(data => {
      menuData = data;
      renderMenu(menuData);
    });

  // 2. Renderizar platos
  function renderMenu(items) {
    menuGrid.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${item.nombre}</h3>
        <p class="card-price">S/ ${item.precio.toFixed(2)}</p>
        <button class="btn-add" onclick="addToCart(${item.id})"><i class="fas fa-plus"></i> Agregar al carrito</button>
      `;
      menuGrid.appendChild(card);
    });
  }

  // 3. Filtros por categoría
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-category");
      if (category === "todos") renderMenu(menuData);
      else renderMenu(menuData.filter(i => i.categoria === category));
    });
  });

  // 4. Carrito
  window.addToCart = (id) => {
    const product = menuData.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
  };

  function updateCartUI() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
      total += item.precio * item.quantity;
      count += item.quantity;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div>
          <strong>${item.nombre}</strong><br>
          <small>S/ ${item.precio.toFixed(2)} x ${item.quantity}</small>
        </div>
        <div>
          <strong>S/ ${(item.precio * item.quantity).toFixed(2)}</strong>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    cartCount.innerText = count;
    cartTotal.innerText = total.toFixed(2);
  }

  // 5. Controles del Modal
  cartBtn.onclick = () => cartModal.style.display = "flex";
  closeBtn.onclick = () => cartModal.style.display = "none";
  window.onclick = (e) => { if (e.target === cartModal) cartModal.style.display = "none"; };

  // 6. Enviar Pedido por WhatsApp
  whatsappSendBtn.onclick = () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    let message = "¡Hola! Quisiera realizar el siguiente pedido en *Chifa Cinco Estrellas*:\n\n";
    let total = 0;

    cart.forEach(item => {
      const subtotal = item.precio * item.quantity;
      total += subtotal;
      message += `• ${item.quantity}x ${item.nombre} - S/ ${subtotal.toFixed(2)}\n`;
    });

    message += `\n*Total a pagar: S/ ${total.toFixed(2)}*`;
    message += `\n\nPor favor confirmar recepción y tiempo estimado de entrega.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/51945036144?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };
});