// Funciones para manejar el carrito con localStorage

// Obtener el carrito del localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Guardar el carrito en localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Agregar item al carrito
function addToCart(drink) {
    const cart = getCart();

    // Simplemente agregar el item sin verificar duplicados
    cart.push(drink);

    saveCart(cart);
    updateCartCount();

    // Mostrar notificación
    showNotification(`${drink.nombre} added to cart!`);
}

// Remover item del carrito por índice
function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
    updateCartCount();
}

// Actualizar contador del carrito en el nav
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.length;

    const countElements = document.querySelectorAll('#cart-count, #cart-count-mobile');
    countElements.forEach(el => {
        if (el) {
            el.textContent = totalItems;
            el.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
}

// Cargar y mostrar items del carrito
function loadCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }

    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.nombre}">
            <div class="cart-item-details">
                <h3>${item.nombre}</h3>
                <p class="cart-item-price">$${item.precio.toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart(${index})" class="remove-btn">
                <i class="ph ph-trash"></i>
            </button>
        </div>
    `).join('');

    // Calcular total
    const subtotal = cart.reduce((sum, item) => sum + item.precio, 0);
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
}

// Limpiar carrito
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        loadCart();
        updateCartCount();
    }
}

// Checkout (simulado)
function checkout() {
    const cart = getCart();
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.precio, 0);
    alert('Thank you for your order! Total: $' + total.toFixed(2));

    localStorage.removeItem('cart');
    loadCart();
    updateCartCount();
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 100);

    // Ocultar y remover después de 2 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Si estamos en la página del carrito, cargar los items
    if (document.getElementById('cart-items')) {
        loadCart();
    }
});
