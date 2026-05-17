document.addEventListener('DOMContentLoaded', () => {

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemCount = document.querySelector('.cart-icon span');
    const cartItemsList = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartIcon = document.querySelector('.cart-icon');
    const sidebar = document.getElementById('sidebar');
    const closeButton = document.querySelector('.sidebar-close');
    const overlay = document.getElementById('overlay');

    // 🧠 Load cart from LocalStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // =========================
    // 💾 SAVE CART
    // =========================
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // =========================
    // 💰 TOTAL
    // =========================
    function calculateTotal() {
        return cartItems.reduce((sum, item) =>
            sum + item.price * item.quantity, 0
        );
    }

    // =========================
    // 🔢 TOTAL ITEMS COUNT
    // =========================
    function getTotalItemsCount() {
        return cartItems.reduce((total, item) =>
            total + item.quantity, 0
        );
    }

    // =========================
    // 🛒 ADD TO CART
    // =========================
    addToCartButtons.forEach((button, index) => {

        button.addEventListener('click', () => {

            const item = {
                name: document.querySelectorAll('.card .card--title')[index].textContent,
                price: parseFloat(
                    document.querySelectorAll('.price')[index].textContent.slice(1)
                ),
                quantity: 1
            };

            const existingItem = cartItems.find(
                (cartItem) => cartItem.name === item.name
            );

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push(item);
            }

            updateCartUI();
        });
    });

    // =========================
    // 🧠 UPDATE UI
    // =========================
    function updateCartUI() {
        updateCartItemList();
        updateCartItemCount();
        updateCartTotal();
        saveCart();
    }

    // =========================
    // 🔢 COUNT
    // =========================
    function updateCartItemCount() {
        cartItemCount.textContent = getTotalItemsCount();
    }

    // =========================
    // 🧾 RENDER CART
    // =========================
    function updateCartItemList() {

        cartItemsList.innerHTML = '';

        cartItems.forEach((item, index) => {

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'individual-cart-item');

            cartItem.innerHTML = `
                <span class="item-name">
                    (${item.quantity}x) ${item.name}
                </span>

                <div class="cart-actions">

                    <button class="qty-btn decrease" data-index="${index}">-</button>

                    <span class="cart-item-price">
                        $${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button class="qty-btn increase" data-index="${index}">+</button>

                    <button class="remove-item" data-index="${index}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                </div>
            `;

            cartItemsList.appendChild(cartItem);
        });
    }

    // =========================
    // ➕ ➖ ❌ CART ACTIONS
    // =========================
    cartItemsList.addEventListener('click', (event) => {

        const target = event.target;

        const index = target.dataset.index;

        if (target.classList.contains('increase')) {
            cartItems[index].quantity++;
        }

        if (target.classList.contains('decrease')) {
            cartItems[index].quantity--;

            if (cartItems[index].quantity <= 0) {
                cartItems.splice(index, 1);
            }
        }

        if (target.closest('.remove-item')) {
            const removeIndex = target.closest('.remove-item').dataset.index;
            cartItems.splice(removeIndex, 1);
        }

        updateCartUI();
    });

    // =========================
    // 💰 TOTAL UPDATE
    // =========================
    function updateCartTotal() {
        cartTotal.textContent = `$${calculateTotal().toFixed(2)}`;
    }

    // =========================
    // 🧾 SIDEBAR OPEN
    // =========================
    cartIcon.addEventListener('click', () => {
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
    });

    // =========================
    // ❌ SIDEBAR CLOSE
    // =========================
    function closeSidebar() {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }

    closeButton.addEventListener('click', closeSidebar);

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // =========================
    // 🚀 INIT
    // =========================
    updateCartUI();

});