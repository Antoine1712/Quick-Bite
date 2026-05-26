document.addEventListener('DOMContentLoaded', () => {

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemCount = document.querySelector('.cart-icon span');
    const cartItemsList = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartIcon = document.querySelector('.cart-icon');
    const sidebar = document.getElementById('sidebar');

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // =========================
    // SAVE CART
    // =========================
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // =========================
    // ADD TO CART
    // =========================
    addToCartButtons.forEach((button) => {

        button.addEventListener('click', () => {

            const card = button.closest('.card');

            const item = {
                id: crypto.randomUUID(),
                name: card.dataset.name,
                price: Number(card.dataset.price),
                quantity: 1,
            };

            const existingItem = cartItems.find(i => i.name === item.name);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push(item);
            }

            saveCart();
            updateCartUI();
        });
    });

    // =========================
    // UPDATE UI
    // =========================
    function updateCartUI() {
        updateCartCount();
        updateCartList();
        updateCartTotal();
    }

    // =========================
    // COUNT
    // =========================
    function updateCartCount() {
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCount.textContent = count;
    }

    // =========================
    // CART LIST (VERSION PRO DOM PUR)
    // =========================
    function updateCartList() {

        cartItemsList.innerHTML = '';

        if (cartItems.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = "Votre panier est vide 🛒";
            empty.style.color = "gray";
            empty.style.textAlign = "center";
            cartItemsList.appendChild(empty);
            return;
        }

        cartItems.forEach((item) => {

            const cartItem = document.createElement('div');
            cartItem.classList.add('individual-cart-item');

            // LEFT SIDE (name + quantity)
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `(${item.quantity}x) ${item.name}`;

            // RIGHT SIDE (price + button)
            const priceSpan = document.createElement('span');
            priceSpan.classList.add('cart-item-price');

            priceSpan.textContent = `€${(item.price * item.quantity).toFixed(2)}`;

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-item');
            removeBtn.dataset.id = item.id;

            const icon = document.createElement('i');
            icon.classList.add('fa-solid', 'fa-times');

            removeBtn.appendChild(icon);
            priceSpan.appendChild(removeBtn);

            cartItem.appendChild(nameSpan);
            cartItem.appendChild(priceSpan);

            cartItemsList.appendChild(cartItem);
        });
    }

    // =========================
    // REMOVE ITEM (event delegation)
    // =========================
    cartItemsList.addEventListener('click', (e) => {
        const btn = e.target.closest('.remove-item');
        if (!btn) return;

        removeItem(btn.dataset.id);
    });

    function removeItem(id) {
        cartItems = cartItems.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }

    // =========================
    // TOTAL
    // =========================
    function updateCartTotal() {

        const total = cartItems.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        cartTotal.textContent = `€${total.toFixed(2)}`;
    }

    // =========================
    // SIDEBAR
    // =========================
    cartIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    document.querySelector('.sidebar-close')
        .addEventListener('click', () => {
            sidebar.classList.remove('open');
        });

    // =========================
    // INIT
    // =========================
    updateCartUI();
});