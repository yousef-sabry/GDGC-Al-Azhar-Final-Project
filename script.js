// ==================== CART MANAGEMENT ====================

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save the current cart state to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ==================== ADD PRODUCT TO CART ====================


function addToCart(product, sizeId, colorId) {
  const size = document.getElementById(sizeId)?.value;
  const color = document.getElementById(colorId)?.value;

  if (!size || !color) {
    alert("Please select size and color.");
    return;
  }

  // Check if product with same size and color already exists
  const existing = cart.findIndex(
    item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
  );

  if (existing !== -1) {
    cart[existing].quantity++;
  } else {
    cart.push({ ...product, selectedSize: size, selectedColor: color, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  alert("Added to cart!");
}

// ==================== CART DISPLAY ====================

/**
 * Update cart display on the cart page
 */
function updateCartUI() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    updateTotals();
    return;
  }

  cart.forEach((item, index) => {
    const productDiv = document.createElement("div");
    productDiv.className = "cart-product";
    productDiv.innerHTML = `
      <img src="${item.image.startsWith('/') ? '.' + item.image : item.image}" alt="${item.name}">

      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>Size: ${item.selectedSize} | Color: ${item.selectedColor}</p>
        <strong>$${item.price}</strong>
      </div>
      <div class="qty-control">
        <button onclick="changeQty(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
    `;
    container.appendChild(productDiv);
  });

  updateTotals();
}

/**
 * Update subtotal, discount, and total
 */
function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.2;
  const delivery = 15;
  const total = subtotal - discount + delivery;

  const updateText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  updateText("subtotal", subtotal.toFixed(2));
  updateText("discount", `-$${discount.toFixed(2)}`);
  updateText("total", total.toFixed(2));
  updateCartCount();
}

// ==================== QUANTITY MANAGEMENT ====================

function changeQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

// ==================== CART COUNT IN HEADER ====================

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// ==================== PRODUCT RENDERING ====================

function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "";
  products.forEach(product => container.appendChild(createProductCard(product)));
}

function renderTopSelling() {
  const container = document.getElementById("top-selling-home");
  if (!container) return;

  container.innerHTML = "";
  topSellingProducts.forEach(product => container.appendChild(createProductCard(product, true)));
}

/**
 * Create a product card element
 */
function createProductCard(product, isTopSelling = false) {
  const card = document.createElement("div");
  card.className = "product-card";

  const sizeOptions = product.sizes.map(s => `<option value="${s}">${s}</option>`).join("");
  const colorOptions = product.colors.map(c => `<option value="${c}">${c}</option>`).join("");
  const prefix = isTopSelling ? "top-" : "";

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h4>${product.name}</h4>
    <p>$${product.price}</p>
    <label>Size:
      <select id="${prefix}size-${product.id}">${sizeOptions}</select>
    </label>
    <label>Color:
      <select id="${prefix}color-${product.id}">${colorOptions}</select>
    </label>
    <button onclick="addToCart(${isTopSelling ? 'topSellingProducts' : 'products'}.find(p => p.id === ${product.id}), '${prefix}size-${product.id}', '${prefix}color-${product.id}')">Add to Cart</button>
  `;
  return card;
}

// ==================== ORDER SUBMISSION ====================

function submitOrder() {
  cart = [];
  saveCart();
  updateCartUI();
  updateCartCount();

  const messageBox = document.getElementById("success-message");
  if (messageBox) {
    messageBox.textContent = "🎉 Your purchase was completed successfully!";
    messageBox.style.display = "block";
  }

  const finishBtn = document.getElementById("finish-btn");
  if (finishBtn) {
    finishBtn.textContent = "Done ✅";
    finishBtn.disabled = true;
    finishBtn.style.backgroundColor = "#28a745";
  }
}

// ==================== INIT ====================

renderProducts();
renderTopSelling();
updateCartUI();
updateCartCount();
