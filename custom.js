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

    cart.push(drink);

    saveCart(cart);
    updateCartCount();

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

    const countElements = document.querySelectorAll('#cart-count, #cart-count-mobile, #cart-count-mobile-icon');
    countElements.forEach(el => {
        if (el) {
            el.textContent = totalItems;
            el.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
}

// cargar items
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
        <div class="relative grid grid-cols-[100px_1fr_auto] gap-6 items-center bg-white p-6 rounded-lg mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:grid-cols-[80px_1fr_auto] md:gap-4">
            <img src="${item.img}" alt="${item.nombre}" class="w-[100px] h-[100px] object-cover rounded-lg md:w-20 md:h-20">
            <div>
                <h3 class="mb-2 text-xl">${item.nombre}</h3>
                <p class="text-[#1d0f08] font-semibold">$${item.precio.toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart(${index})" class="bg-transparent border-none text-[#d32f2f] cursor-pointer text-2xl transition-transform duration-200 hover:scale-110 md:absolute md:right-4">
                <i class="ph ph-trash"></i>
            </button>
        </div>
    `).join('');

    // calcular total
    const subtotal = cart.reduce((sum, item) => sum + item.precio, 0);
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
}

// limpiar carrito
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        loadCart();
        updateCartCount();
    }
}

// checkout
function checkout() {
    const cart = getCart();
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.precio, 0);
    alert('Thank you for your order! Total: $' + total.toFixed(2));

    localStorage.removeItem('cart');
    loadCart();
    updateCartCount();
}

// notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-5 right-5 bg-[#1b1107] text-white px-6 py-4 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)] z-[1000] opacity-0 -translate-y-5 transition-all duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('opacity-0', '-translate-y-5');
        notification.classList.add('opacity-100', 'translate-y-0');
    }, 100);

    setTimeout(() => {
        notification.classList.add('opacity-0', '-translate-y-5');
        notification.classList.remove('opacity-100', 'translate-y-0');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Cargar las bebidas del JSON en el menú
function loadDrinksMenu() {
    fetch('drinks.json')
        .then(response => response.json())
        .then(drinks => {
            const container = document.getElementById('drinks-container');

            if (!container) return;

            drinks.forEach(drink => {
                // Crear la tarjeta de cada bebida
                const card = document.createElement('article');
                card.className = 'group p-4 rounded-3xl transition-all duration-300 hover:-translate-y-2';

                card.innerHTML = `
                    <div class="relative overflow-visible mb-6 flex items-center justify-center h-[300px]">
                        <img src="${drink.img}" alt="${drink.nombre}" class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl filter">
                    </div>
                    
                    <div class="text-center">
                        <h3 class="playfair-display text-3xl font-bold text-[#1b1107] mb-2 tracking-wide">${drink.nombre}</h3>
                        <p class="text-xl font-medium text-[#1b1107]/80 mb-6">$${drink.precio.toFixed(2)}</p>
                        
                        <button class="w-full bg-[#1b1107] text-[#fdfbf8] py-4 px-6 rounded-full font-sans text-base font-semibold tracking-wide transition-all duration-300 hover:bg-[#b89d84] hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none transform active:scale-95" onclick='addToCart(${JSON.stringify(drink)})'>
                            <i class="ph ph-shopping-cart text-xl"></i> <span>Add to Cart</span>
                        </button>
                    </div>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error cargando las bebidas:', error));
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-items')) {
        loadCart();
    }
    if (document.getElementById('drinks-container')) {
        loadDrinksMenu();
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('max-sm:hidden');
            mobileMenu.classList.toggle('max-sm:flex');
        });

        // Cerrar el menú cuando se hace clic en un enlace
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('max-sm:hidden');
                mobileMenu.classList.remove('max-sm:flex');
            });
        });
    }
});
