document.addEventListener('DOMContentLoaded', () => {

  let cart = [];
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const emptyCartMsg = document.getElementById('empty-cart-msg');
  const checkoutWhatsappBtn = document.getElementById('checkout-whatsapp-btn');

  function toggleCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.toggle('active');
      cartOverlay.classList.toggle('active');
    }
  }

  if (openCartBtn) openCartBtn.addEventListener('click', toggleCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
  if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const name = e.target.getAttribute('data-name');
      const price = parseFloat(e.target.getAttribute('data-price'));
      const img = e.target.getAttribute('data-img');

      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({ id, name, price, img, qty: 1 });
      }
      updateCartUI();
      if (!cartDrawer.classList.contains('active')) toggleCart();
    });
  });

  function updateCartUI() {
    if (!cartCount || !cartItemsContainer || !cartTotalPrice) return;
    
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    cartCount.textContent = totalQty;
    cartTotalPrice.textContent = `R ${subtotal.toFixed(2)}`;

    if (cart.length === 0) {
      emptyCartMsg.style.display = 'block';
      cartItemsContainer.innerHTML = '';
    } else {
      emptyCartMsg.style.display = 'none';
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">Qty: ${item.qty} × R ${item.price.toFixed(2)}</div>
            <button class="remove-item-btn" onclick="removeItem('${item.id}')">Remove</button>
          </div>
        </div>
      `).join('');
    }
  }

  window.removeItem = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  };

  if (checkoutWhatsappBtn) {
    checkoutWhatsappBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      let message = 'Hello F7 Branding! I would like to place an order:\n\n';
      cart.forEach(item => {
        message += `- ${item.name} (x${item.qty}) : R${item.price * item.qty}\n`;
      });
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      message += `\nTotal Subtotal: R${subtotal.toFixed(2)}`;
      
      const whatsappUrl = `https://wa.me/27877658654?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const productGrid = document.getElementById('product-grid');

  if (searchInput && productGrid) {
    searchInput.addEventListener('input', filterAndSortProducts);
  }
  if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', filterAndSortProducts);
  }

  function filterAndSortProducts() {
    const query = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;
    const cards = Array.from(productGrid.getElementsByClassName('product-card'));

    cards.forEach(card => {
      const name = card.getAttribute('data-name').toLowerCase();
      if (name.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    if (sortValue !== 'default') {
    cards.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price')) || 0;
        const priceB = parseFloat(b.getAttribute('data-price')) || 0;

        if (sortValue === 'low-to-high') {
            return priceA - priceB;
        } else if (sortValue === 'high-to-low') {
            return priceB - priceA;
        }
        return 0;
    });
    productGrid.innerHTML = '';
    cards.forEach(card => productGrid.appendChild(card));
}
  }
  
  const mapElement = document.getElementById('map');
  if (mapElement && typeof L !== 'undefined') {
    const map = L.map('map').setView([-25.9964, 28.1267], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([-25.9964, 28.1267]).addTo(map)
      .bindPopup('<b>F7 Branding Head Office</b><br>Midrand, Gauteng')
      .openPopup();
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.getElementById('close-lightbox');

  document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', () => {
      if (lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxModal.style.display = 'flex';
        lightboxModal.style.opacity = '1';
        lightboxModal.style.visibility = 'visible';
      }
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
      lightboxModal.style.display = 'none';
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fullname = document.getElementById('fullname').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      const nameErr = document.getElementById('name-error');
      const emailErr = document.getElementById('email-error');
      const phoneErr = document.getElementById('phone-error');
      const msgErr = document.getElementById('message-error');
      const feedback = document.getElementById('form-feedback');

      nameErr.textContent = '';
      emailErr.textContent = '';
      phoneErr.textContent = '';
      msgErr.textContent = '';
      
      let isValid = true;

      if (fullname.length < 2) {
        nameErr.textContent = 'Please enter a valid full name.';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailErr.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      const phoneRegex = /^0[0-9]{9}$/;
      if (phone && !phoneRegex.test(phone)) {
        phoneErr.textContent = 'Please enter a valid 10-digit SA phone number (e.g. 0677328866).';
        isValid = false;
      }

      if (message.length < 5) {
        msgErr.textContent = 'Message must be at least 5 characters long.';
        isValid = false;
      }

      if (isValid) {
        feedback.style.display = 'block';
        feedback.style.backgroundColor = '#1e3a1e';
        feedback.style.color = '#bfff00';
        feedback.textContent = 'Sending message asynchronously...';

        setTimeout(() => {
          feedback.textContent = 'Thank you! Your message has been sent successfully to F7 Branding.';
          contactForm.reset();
        }, 1200);
      }
    });
  }

});