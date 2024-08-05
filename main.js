const products = [
    {
        id: 1,
        title: "Autumn Hoodie",
        price: 345,
        image: "image/AUTUMN HOODIES.jfif", // Ensure the image path is correct
    },
    {
        id: 2,
        title: "Caps",
        price: 245,
        image: "image/caps.jpg",
    },
    {
        id: 3,
        title: "Shirts",
        price: 1256,
        image: "image/shirts.jpg",
    },
    {
        id: 4,
        title: "Pants",
        price: 1045,
        image: "image/pents.png",
    },
    {
        id: 5,
        title: "Coats",
        price: 15000,
        image: "image/coat.png",
    }
];

const productlist = document.getElementById("productlist");
const cartitemcartelement = document.getElementById("cartitems");
const carttotalelement = document.getElementById("carttotal");
const cartIconElement = document.getElementById("cart-icon");

// Load cart from local storage or initialize as empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render Products on the Home Page
function renderProducts() {
    if (!productlist) return;

    productlist.innerHTML = products.map((product) => `
        <div class="product">
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h2 class="product-title">${product.title}</h2>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join("");

    // Attach event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", addToCart);
    });
}

// Add to Cart Functionality
function addToCart(event) {
    const productId = parseInt(event.target.dataset.id);
    const product = products.find((product) => product.id === productId);

    const existingCartItem = cart.find((item) => item.id === productId);

    if (existingCartItem) {
        // Increase quantity if already in cart
        existingCartItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push({ ...product, quantity: 1 });
    }

    event.target.textContent = "added";


    // Save cart to local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart total in UI
    updateCartTotal();

    // Update cart icon quantity
    updateCartIconQuantity();
}

// Render Cart Items on Cart Page
function renderCartItems() {
    if (!cartitemcartelement) return; // Ensure the cart element exists

    cartitemcartelement.innerHTML = cart.map((item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <h2 class="cart-item-title">${item.title}</h2>
                <input class="cart-item-quantity" type="number" min="1" value="${item.quantity}" data-id="${item.id}">
            </div>
            <h2 class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</h2>
            <button class="remove-from-cart" data-id="${item.id}">Remove from Cart</button>
        </div>
    `).join("");

    // Attach event listeners to all "Remove from Cart" buttons
    const removeFromCartButtons = document.querySelectorAll(".remove-from-cart");
    removeFromCartButtons.forEach(button => {
        button.addEventListener("click", removeFromCart);
    });

    // Attach event listeners to quantity inputs
    const quantityInputs = document.querySelectorAll(".cart-item-quantity");
    quantityInputs.forEach(input => {
        input.addEventListener("change", updateQuantity);
    });

    updateCartTotal();
}

// Remove from Cart Functionality
function removeFromCart(event) {
    const productId = parseInt(event.target.dataset.id);
    cart = cart.filter((item) => item.id !== productId);

    // Save updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Re-render cart items
    renderCartItems();
    updateCartTotal(); 
    // Update cart icon quantity
    updateCartIconQuantity();
}

// Update Quantity in Cart
function updateQuantity(event) {
    const input = event.target;
    const productId = parseInt(input.dataset.id);
    const newQuantity = parseInt(input.value);

    if (newQuantity <= 0) {
        removeFromCart(event);
        return;
    }

    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
    }

    // Save updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartTotal();
}

// Update Cart Total
function updateCartTotal() {
    if (!carttotalelement) return; // Ensure the cart total element exists

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    carttotalelement.innerHTML = `Total: $${total.toFixed(2)}`;
}

// Update Cart Icon Quantity
function updateCartIconQuantity() {
    if (!cartIconElement) return;

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartIconElement.setAttribute('data-quantity', totalItems);
}

// Initial Render based on Page
if (window.location.pathname.toLowerCase().includes("cart.html")) {
    renderCartItems();
    updateCartTotal();
} else {
    renderProducts();
}

// Update the cart icon quantity on page load
updateCartIconQuantity();
updateCartTotal();
