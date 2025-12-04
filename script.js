// Business Data
const businessData = {
    name: "AJ ICONIC CHIPS JOINT",
    established: "2023",
    location: "Outspan Centre, Eldoret",
    phone: "0715209233",
    mpesaNumber: "0715209233",
    accountName: "Alex Kipchumba",
    openingTime: 10, // 10:00 AM
    closingTime: 20  // 8:00 PM
};

// Menu Items
const menuItems = [
    {
        id: 1,
        name: "Regular Chips",
        description: "Crispy golden chips, perfectly salted",
        price: 70,
        image: "🍟"
    },
    {
        id: 2,
        name: "Medium Chips",
        description: "Larger portion of our signature chips",
        price: 100,
        image: "🍟"
    },
    {
        id: 3,
        name: "Large Chips",
        description: "Family-sized portion, perfect for sharing",
        price: 150,
        image: "🍟"
    },
    {
        id: 4,
        name: "Family Pack",
        description: "Extra large pack for the whole family",
        price: 200,
        image: "🍟"
    },
    {
        id: 5,
        name: "Chips + Sausage",
        description: "Chips served with juicy sausage",
        price: 120,
        image: "🌭"
    },
    {
        id: 6,
        name: "Chips + Eggs",
        description: "Chips with two fried eggs",
        price: 130,
        image: "🍳"
    },
    {
        id: 7,
        name: "Chips + Chicken",
        description: "Chips with grilled chicken pieces",
        price: 250,
        image: "🍗"
    },
    {
        id: 8,
        name: "Chips + Fish",
        description: "Chips with fried fish fillet",
        price: 280,
        image: "🐟"
    },
    {
        id: 9,
        name: "Soft Drink (500ml)",
        description: "Coca-Cola, Fanta, or Sprite",
        price: 80,
        image: "🥤"
    },
    {
        id: 10,
        name: "Bottle Water",
        description: "500ml bottled water",
        price: 50,
        image: "💧"
    }
];

// Shopping Cart
let cart = [];
let deliveryCharge = 0;

// DOM Elements
const cartCountElement = document.querySelector('.cart-count');
const menuGrid = document.getElementById('menuGrid');
const menuSelect = document.getElementById('menuSelect');
const cartItems = document.getElementById('cartItems');
const subtotalElement = document.getElementById('subtotal');
const deliveryChargeElement = document.getElementById('deliveryCharge');
const totalAmountElement = document.getElementById('totalAmount');
const checkoutBtn = document.getElementById('checkoutBtn');
const statusBadge = document.getElementById('statusBadge');
const deliveryAddress = document.getElementById('deliveryAddress');
const deliveryOptions = document.querySelectorAll('input[name="delivery"]');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check business hours
    checkBusinessHours();
    
    // Load menu items
    loadMenuItems();
    loadMenuSelect();
    
    // Load cart from localStorage
    loadCart();
    
    // Update cart display
    updateCartDisplay();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup smooth scrolling for navigation
    setupSmoothScrolling();
});

// Check if business is open
function checkBusinessHours() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 100;
    
    const isOpen = currentTime >= businessData.openingTime && 
                   currentTime <= businessData.closingTime;
    
    const statusElement = statusBadge.querySelector('span');
    
    if (isOpen) {
        statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> <span>We are OPEN! Order now</span>';
        statusBadge.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
        statusBadge.style.color = '#27ae60';
    } else {
        statusBadge.innerHTML = '<i class="fas fa-clock"></i> <span>Closed now. Opens at 10:00 AM</span>';
        statusBadge.style.backgroundColor = 'rgba(231, 76, 60, 0.2)';
        statusBadge.style.color = '#c0392b';
    }
}

// Load menu items to display
function loadMenuItems() {
    menuGrid.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-card';
        
        menuCard.innerHTML = `
            <div class="menu-image">
                <span style="font-size: 80px;">${item.image}</span>
            </div>
            <div class="menu-content">
                <h3>${item.name}</h3>
                <p class="menu-description">${item.description}</p>
                <div class="menu-price">KSH ${item.price}</div>
                <div class="menu-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                        <input type="text" class="quantity-input" id="qty-${item.id}" value="1" readonly>
                        <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addItemToCart(${item.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        menuGrid.appendChild(menuCard);
    });
}

// Load menu items for selection form
function loadMenuSelect() {
    menuSelect.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-select-item';
        menuItem.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
            </div>
            <div class="item-price">KSH ${item.price}</div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="decreaseSelectQuantity(${item.id})">-</button>
                <input type="text" class="quantity-input" id="select-qty-${item.id}" value="0" readonly>
                <button class="quantity-btn" onclick="increaseSelectQuantity(${item.id})">+</button>
            </div>
        `;
        
        menuSelect.appendChild(menuItem);
    });
}

// Cart Functions
function addItemToCart(itemId) {
    const quantityInput = document.getElementById(`qty-${itemId}`);
    const quantity = parseInt(quantityInput.value);
    
    if (quantity <= 0) return;
    
    addToCart(itemId, quantity);
    quantityInput.value = '1'; // Reset quantity
}

function addToCart(itemId, quantity) {
    const item = menuItems.find(i => i.id === itemId);
    
    if (!item) return;
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(i => i.id === itemId);
    
    if (existingItemIndex !== -1) {
        // Update existing item quantity
        cart[existingItemIndex].quantity += quantity;
        cart[existingItemIndex].total = cart[existingItemIndex].quantity * item.price;
    } else {
        // Add new item to cart
        cart.push({
            id: itemId,
            name: item.name,
            price: item.price,
            quantity: quantity,
            total: item.price * quantity
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart display
    updateCartDisplay();
    
    // Show success notification
    showNotification(`Added ${quantity} x ${item.name} to cart`, 'success');
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart', 'info');
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>KSH ${item.price} × ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-price">KSH ${item.total}</div>
                    <div class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        checkoutBtn.disabled = false;
    }
    
    // Calculate and update totals
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    
    // Check delivery option
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    deliveryCharge = deliveryOption === 'delivery' ? 50 : 0;
    
    const total = subtotal + deliveryCharge;
    
    subtotalElement.textContent = `KSH ${subtotal}`;
    deliveryChargeElement.textContent = `KSH ${deliveryCharge}`;
    totalAmountElement.textContent = `KSH ${total}`;
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('Cart cleared', 'info');
        
        // Reset all select quantities
        menuItems.forEach(item => {
            const selectQty = document.getElementById(`select-qty-${item.id}`);
            if (selectQty) selectQty.value = '0';
        });
    }
}

// Quantity Controls
function increaseQuantity(itemId) {
    const input = document.getElementById(`qty-${itemId}`);
    const currentValue = parseInt(input.value);
    input.value = currentValue + 1;
}

function decreaseQuantity(itemId) {
    const input = document.getElementById(`qty-${itemId}`);
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

function increaseSelectQuantity(itemId) {
    const input = document.getElementById(`select-qty-${itemId}`);
    const currentValue = parseInt(input.value);
    input.value = currentValue + 1;
}

function decreaseSelectQuantity(itemId) {
    const input = document.getElementById(`select-qty-${itemId}`);
    const currentValue = parseInt(input.value);
    if (currentValue > 0) {
        input.value = currentValue - 1;
    }
}

// Add items from selection form to cart
function addToCart() {
    let addedItems = false;
    
    menuItems.forEach(item => {
        const quantityInput = document.getElementById(`select-qty-${item.id}`);
        const quantity = parseInt(quantityInput.value);
        
        if (quantity > 0) {
            addToCart(item.id, quantity);
            quantityInput.value = '0'; // Reset after adding
            addedItems = true;
        }
    });
    
    if (!addedItems) {
        showNotification('Please select at least one item', 'warning');
    }
}

// Checkout Process
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }
    
    // Get customer details
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    
    if (!customerName || !customerPhone) {
        showNotification('Please enter your name and phone number', 'warning');
        return;
    }
    
    // Check delivery option
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    const deliveryAddressValue = document.getElementById('address').value.trim();
    
    if (deliveryOption === 'delivery' && !deliveryAddressValue) {
        showNotification('Please enter delivery address', 'warning');
        return;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const deliveryCharge = deliveryOption === 'delivery' ? 50 : 0;
    const total = subtotal + deliveryCharge;
    
    // Generate order reference
    const orderRef = `AJ${Date.now().toString().slice(-6)}`;
    
    // Show order confirmation modal
    document.getElementById('orderRef').textContent = orderRef;
    document.getElementById('orderTotal').textContent = `KSH ${total}`;
    document.getElementById('paymentAmount').textContent = `KSH ${total}`;
    document.getElementById('orderCustomer').textContent = customerName;
    document.getElementById('orderPhone').textContent = customerPhone;
    
    // Save order
    saveOrder(orderRef, customerName, customerPhone, deliveryOption, deliveryAddressValue, total);
    
    // Show modal
    document.getElementById('orderModal').style.display = 'flex';
    
    // Clear form and cart
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('address').value = '';
    
    cart = [];
    saveCart();
    updateCartDisplay();
}

// Save order to localStorage
function saveOrder(orderRef, customerName, customerPhone, deliveryOption, deliveryAddress, total) {
    const order = {
        id: orderRef,
        date: new Date().toISOString(),
        customerName,
        customerPhone,
        deliveryOption,
        deliveryAddress,
        items: [...cart],
        subtotal: cart.reduce((sum, item) => sum + item.total, 0),
        deliveryCharge: deliveryOption === 'delivery' ? 50 : 0,
        total
    };
    
    // Get existing orders from localStorage
    const orders = JSON.parse(localStorage.getItem('ajChipsOrders') || '[]');
    orders.push(order);
    
    // Save back to localStorage
    localStorage.setItem('ajChipsOrders', JSON.stringify(orders));
    
    // In a real app, you would send this to a server
    console.log('Order saved:', order);
    
    // Show notification
    showNotification(`Order ${orderRef} placed successfully!`, 'success');
}

// Setup event listeners
function setupEventListeners() {
    // Delivery option change
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'delivery') {
                deliveryAddress.style.display = 'block';
            } else {
                deliveryAddress.style.display = 'none';
            }
            updateCartDisplay();
        });
    });
    
    // Message form submission
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Message sent successfully! We\'ll contact you soon.', 'success');
            this.reset();
        });
    }
    
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Cart modal
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCartModal();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const cartModal = document.getElementById('cartModal');
        const orderModal = document.getElementById('orderModal');
        
        if (e.target === cartModal) {
            closeCartModal();
        }
        
        if (e.target === orderModal) {
            closeOrderModal();
        }
    });
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Modal Functions
function openCartModal() {
    const modalCartItems = document.getElementById('modalCartItems');
    const modalTotal = document.getElementById('modalTotal');
    
    if (cart.length === 0) {
        modalCartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        modalTotal.textContent = 'KSH 0';
    } else {
        modalCartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>KSH ${item.price} × ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-price">KSH ${item.total}</div>
                </div>
            `;
            modalCartItems.appendChild(cartItem);
            total += item.total;
        });
        
        modalTotal.textContent = `KSH ${total}`;
    }
    
    document.getElementById('cartModal').style.display = 'flex';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                z-index: 3000;
                animation: slideIn 0.3s ease;
                max-width: 350px;
            }
            .notification-success {
                background-color: #27ae60;
                border-left: 4px solid #219653;
            }
            .notification-warning {
                background-color: #f39c12;
                border-left: 4px solid #e67e22;
            }
            .notification-info {
                background-color: #3498db;
                border-left: 4px solid #2980b9;
            }
            .notification-error {
                background-color: #e74c3c;
                border-left: 4px solid #c0392b;
            }
            .notification-content {
                display: flex;
                align-items: center;
            }
            .notification-content i {
                margin-right: 10px;
                font-size: 20px;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

// LocalStorage functions
function saveCart() {
    localStorage.setItem('ajChipsCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('ajChipsCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Update business hours badge every minute
setInterval(checkBusinessHours, 60000);
