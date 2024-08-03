document.addEventListener('DOMContentLoaded', function() {
    function loadProducts(category) {
        const products = {
            vegetables: [
                { name: 'Fresh Tomatoes', price: 40, weight: 500, image: 'pics/Fresh Tomatoes.jpg' },
                { name: 'Crunchy Carrots', price: 35, weight: 500, image: 'pics/Crunchy Carrots.jpg' },
                { name: 'Green Bell Peppers', price: 30, weight: 250, image: 'pics/Colorful Bell Peppers.jpg' },
                { name: 'Crisp Lettuce', price: 25, weight: 300, image: 'pics/lettuce.jpg' },
                { name: 'Red Onions', price: 20, weight: 500, image: 'pics/Red Onions.jpg' },
                { name: 'Fresh Cucumbers', price: 30, weight: 500, image: 'pics/Crisp Cucumbers.jpg' }
            ],
            fruits: [
                { name: 'Crisp Apples', price: 120, weight: 1000, image: 'pics/Crisp Apples.jpg' },
                { name: 'Ripe Bananas', price: 50, weight: 1000, image: 'pics/Ripe Bananas.jpg' },
                { name: 'Juicy Oranges', price: 80, weight: 1000, image: 'pics/oranges.jpg' },
                { name: 'Sweet Strawberries', price: 100, weight: 250, image: 'pics/strawberries.jpg' },
                { name: 'Fresh Blueberries', price: 150, weight: 250, image: 'pics/fritus.jpg' },
                { name: 'Ripe Mangoes', price: 90, weight: 500, image: 'pics/mangoes.jpg' }
            ],
            greens: [
                { name: 'Organic Spinach', price: 30, weight: 200, image: 'pics/spinach.jpg' },
                { name: 'Fresh Kale', price: 40, weight: 200, image: 'pics/Fresh Kale.jpg' },
                { name: 'Crisp Arugula', price: 35, weight: 150, image: 'pics/Peppery Arugula.jpg' },
                { name: 'Swiss Chard', price: 45, weight: 200, image: 'pics/Swiss Chard.jpg' },
                { name: 'Baby Lettuce Mix', price: 50, weight: 250, image: 'pics/Lettuce.jpg' },
                { name: 'Fresh Collard Greens', price: 40, weight: 200, image: 'pics/Collard Greens.jpg' }
            ]
        };

        const productContainer = document.querySelector(`#${category} .row`);
        if (productContainer) {
            productContainer.innerHTML = '';
            products[category].forEach(product => {
                const productCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text price">₹${product.price}</p>
                                <p class="card-text weight">${product.weight}g</p>
                                <div class="input-group mb-3">
                                    <input type="number" class="form-control quantity-input" value="1" min="1">
                                    <button class="btn btn-primary add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += productCard;
            });
        }
    }

    // Load initial products for all categories
    loadProducts('vegetables');
    loadProducts('fruits');
    loadProducts('greens');

    // Handle tab changes
    const productTabs = document.querySelectorAll('#myTab button');
    productTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function (e) {
            const category = e.target.getAttribute('aria-controls');
            loadProducts(category);
        });
    });

    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const quantity = parseInt(e.target.parentElement.querySelector('.quantity-input').value);
            
            // Here you would add the item to the cart
            console.log(`Added to cart: ${quantity} x ${name} at ₹${price} each`);
            // You can implement the actual cart functionality here
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'mb-3', 'p-3', 'border');
            cartItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>${item.name}</h5>
                        <p>Price: ₹${item.price}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Total: ₹${itemTotal}</p>
                    </div>
                    <div>
                        <button class="btn btn-primary remove-one" data-index="${index}">Remove One</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        document.getElementById('total-price').textContent = totalPrice;
    }

    function addToCart(name, price, quantity) {
        const existingItemIndex = cart.findIndex(item => item.name === name);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }
        saveCart();
        updateCartDisplay();
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const quantity = parseInt(e.target.parentElement.querySelector('.quantity-input').value);
            addToCart(name, price, quantity);
        }

        if (e.target.classList.contains('remove-one')) {
            const index = e.target.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            updateCartDisplay();
        }

        if (e.target.id === 'delete-all') {
            cart.length = 0;
            saveCart();
            updateCartDisplay();
        }

        if (e.target.id === 'buy-now') {
            alert('Thank you for your purchase!');
            cart.length = 0;
            saveCart();
            updateCartDisplay();
        }
    });

    updateCartDisplay();
});


document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function showToast() {
        const toastEl = document.getElementById('cart-toast');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    function addToCart(name, price, quantity) {
        const existingItemIndex = cart.findIndex(item => item.name === name);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }
        saveCart();
        showToast(); // Show toast notification
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const quantity = parseInt(e.target.parentElement.querySelector('.quantity-input').value);
            addToCart(name, price, quantity);
        }
    });
});

