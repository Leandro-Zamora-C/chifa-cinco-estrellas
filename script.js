document.addEventListener("DOMContentLoaded", () => {
  const menuGrid = document.getElementById("menu-grid");
  const filterButtons = document.querySelectorAll(".btn-filter");
  let menuData = [];

  // Cargar datos del menú desde el archivo JSON
  fetch("assets/menu.json")
    .then(res => res.json())
    .then(data => {
      menuData = data;
      renderMenu(menuData);
    })
    .catch(err => console.error("Error al cargar la carta:", err));

  function renderMenu(items) {
    menuGrid.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${item.nombre}</h3>
        <p class="card-price">${item.precio}</p>
      `;
      menuGrid.appendChild(card);
    });
  }

  // Filtrar categorías
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const category = btn.getAttribute("data-category");
      if (category === "todos") {
        renderMenu(menuData);
      } else {
        const filtered = menuData.filter(i => i.categoria === category);
        renderMenu(filtered);
      }
    });
  });
});