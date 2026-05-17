document.addEventListener('DOMContentLoaded', () => {

    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    const confirmBtn = document.getElementById('confirm-order');

    const paymentOverlay = document.getElementById('paymentOverlay');
    const paymentForm = document.getElementById('paymentForm');

    // 💳 INPUTS
    const cardNameInput = document.getElementById('cardName');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvcInput = document.getElementById('cardCvc');

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // =========================
    // 💰 TOTAL
    // =========================
    function calculateTotal() {
        return cartItems.reduce((sum, item) =>
            sum + item.price * item.quantity, 0
        );
    }

    // =========================
    // 🧾 RENDER CHECKOUT
    // =========================
    function renderCheckout() {

        checkoutItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            checkoutItemsContainer.innerHTML = "<p>Votre panier est vide.</p>";
            checkoutTotal.textContent = "$0.00";
            return;
        }

        cartItems.forEach(item => {

            const div = document.createElement('div');
            div.classList.add('checkout-item');

            div.innerHTML = `
                <span>${item.name} (${item.quantity}x)</span>
                <span>${(item.price * item.quantity).toFixed(2)}€</span>
            `;

            checkoutItemsContainer.appendChild(div);
        });

        checkoutTotal.textContent = `${calculateTotal().toFixed(2)}€`;
    }

    // =========================
    // 💳 OPEN PAYMENT
    // =========================
    confirmBtn.addEventListener('click', () => {

        if (cartItems.length === 0) {
            alert("Votre panier est vide !");
            return;
        }

        paymentOverlay.style.display = 'flex';
    });

    // =========================
    // ✍️ NAME FORMAT
    // =========================
    cardNameInput.addEventListener('input', (e) => {

        let value = e.target.value;

        value = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        value = value.replace(/\s{2,}/g, ' ');

        e.target.value = value;
    });

    cardNameInput.addEventListener('blur', (e) => {

        let value = e.target.value.trim().toLowerCase();

        value = value.replace(/\b\w/g, c => c.toUpperCase());

        e.target.value = value;
    });

    // =========================
    // 💳 CARD NUMBER FORMAT
    // =========================
    cardNumberInput.addEventListener('input', (e) => {

        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 16);
        value = value.replace(/(.{4})/g, '$1 ').trim();

        e.target.value = value;
    });

    // =========================
    // 📅 EXPIRY FORMAT
    // =========================
    cardExpiryInput.addEventListener('input', (e) => {

        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 4);

        if (value.length >= 3) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }

        e.target.value = value;
    });

    // =========================
    // 🔐 CVC FORMAT
    // =========================
    cardCvcInput.addEventListener('input', (e) => {

        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 3);

        e.target.value = value;
    });

    // =========================
    // 💳 PAYMENT SIMULATION
    // =========================
    paymentForm.addEventListener('submit', (e) => {

        e.preventDefault();

        paymentOverlay.innerHTML = `
            <div class="payment-box">
                <h2>⏳ Paiement en cours...</h2>
                <p>Veuillez patienter</p>
            </div>
        `;

        setTimeout(() => {

            paymentOverlay.innerHTML = `
                <div class="payment-box">
                    <h2>✅ Paiement réussi !</h2>
                    <p>Merci pour votre commande 🍔</p>
                </div>
            `;

            // vider panier
            localStorage.removeItem('cart');
            cartItems = [];

            renderCheckout();

            setTimeout(() => {
                paymentOverlay.style.display = 'none';
                window.location.href = "index.html";
            }, 2000);

        }, 2000);
    });

    // =========================
    // 🚀 INIT
    // =========================
    renderCheckout();

});