document.addEventListener('DOMContentLoaded', () => {

    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');

    const confirmBtn = document.getElementById('confirm-order');

    const paymentOverlay = document.getElementById('paymentOverlay');
    const paymentForm = document.getElementById('paymentForm');

    const successOverlay = document.getElementById('successOverlay');

    // =========================
    // SAFE LOAD CART
    // =========================
    let cartItems = [];

    try {
        cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cartItems = [];
    }

    // =========================
    // CALCUL TOTAL (source unique de vérité)
    // =========================
    function calculateTotal() {
        return cartItems.reduce((sum, item) => {
            return sum + (Number(item.price) * Number(item.quantity));
        }, 0);
    }

    // =========================
    // RENDER CHECKOUT
    // =========================
    function renderCheckout() {

        checkoutItemsContainer.innerHTML = '';

        if (!cartItems.length) {
            checkoutItemsContainer.innerHTML = `
                <p style="color:gray; text-align:center;">
                    🛒 Votre panier est vide
                </p>
            `;
            checkoutTotal.textContent = "€0.00";
            return;
        }

        cartItems.forEach(item => {

            const div = document.createElement('div');
            div.classList.add('checkout-item');

            const price = Number(item.price) * Number(item.quantity);

            div.innerHTML = `
                <span>${item.name} (${item.quantity}x)</span>
                <span>€${price.toFixed(2)}</span>
            `;

            checkoutItemsContainer.appendChild(div);
        });

        checkoutTotal.textContent = `€${calculateTotal().toFixed(2)}`;
    }

    // =========================
    // OPEN PAYMENT
    // =========================
    confirmBtn.addEventListener('click', () => {

        if (!cartItems.length) {
            alert("Votre panier est vide !");
            return;
        }

        paymentOverlay.style.display = 'flex';
    });

    // =========================
    // CARD FORMAT
    // =========================
    const cardNumber = document.getElementById('cardNumber');

    cardNumber.addEventListener('input', (e) => {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/(.{4})/g, '$1 ')
            .trim();
    });

    // =========================
    // PAYMENT SUBMIT
    // =========================
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('cardName').value.trim();
        const number = document.getElementById('cardNumber').value.trim();
        const expiry = document.getElementById('cardExpiry').value.trim();
        const cvc = document.getElementById('cardCvc').value.trim();

        if (!name || !number || !expiry || !cvc) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        // fermer paiement
        paymentOverlay.style.display = 'none';

        // success animation
        successOverlay.style.display = 'flex';

        // clear cart
        setTimeout(() => {
            localStorage.removeItem('cart');
            cartItems = [];
            renderCheckout();
        }, 800);

        // redirect
        setTimeout(() => {
            successOverlay.style.display = 'none';
            window.location.href = "index.html";
        }, 2500);
    });

    // =========================
    // INIT
    // =========================
    renderCheckout();
});