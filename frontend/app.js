// EcoFinds Marketplace Application

// Application state
let appState = {
  isAuthenticated: false,
  currentUser: null,
  currentView: 'home',
  cart: [],
  searchTerm: '',
  filters: {
    category: '',
    condition: '',
    priceRange: ''
  },
  editingProduct: null
};

// Application data from JSON
const appData = {
  categories: [
    {"id": 1, "name": "Electronics", "icon": "📱", "count": 45, "description": "Phones, laptops, gadgets"},
    {"id": 2, "name": "Clothing", "icon": "👕", "count": 67, "description": "Fashion and apparel"},
    {"id": 3, "name": "Books", "icon": "📚", "count": 89, "description": "Books and educational materials"},
    {"id": 4, "name": "Home & Garden", "icon": "🏠", "count": 34, "description": "Furniture and home decor"},
    {"id": 5, "name": "Sports", "icon": "⚽", "count": 23, "description": "Sports and fitness equipment"},
    {"id": 6, "name": "Toys", "icon": "🧸", "count": 28, "description": "Kids toys and games"}
  ],
  products: [
    {
      "id": 1,
      "title": "iPhone 13 Pro - Excellent Condition",
      "description": "Barely used iPhone 13 Pro in pristine condition. Comes with original box, charger, and screen protector already applied. Battery health at 98%. Perfect for someone looking for a premium phone at a great price.",
      "price": 799,
      "condition": "Like New",
      "category": "Electronics",
      "category_id": 1,
      "seller": "TechSaver92",
      "seller_id": 1,
      "location": "San Francisco, CA",
      "image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
      "images": ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop"],
      "status": "active",
      "created_at": "2024-09-01T10:00:00Z"
    },
    {
      "id": 2,
      "title": "Vintage Leather Jacket - Medium",
      "description": "Authentic vintage leather jacket from the 90s. Genuine leather with beautiful aging. Perfect for fall and winter. Some minor scuffs that add to its character. Classic biker style that never goes out of fashion.",
      "price": 89,
      "condition": "Good",
      "category": "Clothing",
      "category_id": 2,
      "seller": "VintageVibes",
      "seller_id": 2,
      "location": "New York, NY",
      "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
      "images": ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop"],
      "status": "active",
      "created_at": "2024-08-28T15:30:00Z"
    },
    {
      "id": 3,
      "title": "Complete Harry Potter Book Set",
      "description": "Complete collection of all 7 Harry Potter books in paperback. Books are in good condition with minimal wear. Perfect for a young reader or collector. All books included from Philosopher's Stone to Deathly Hallows.",
      "price": 45,
      "condition": "Good",
      "category": "Books",
      "category_id": 3,
      "seller": "BookLover123",
      "seller_id": 3,
      "location": "Austin, TX",
      "image": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop",
      "images": ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop"],
      "status": "active",
      "created_at": "2024-08-25T09:15:00Z"
    },
    {
      "id": 4,
      "title": "Modern Coffee Table - Oak Wood",
      "description": "Beautiful oak coffee table with modern Scandinavian design. Solid wood construction with minor surface scratches but very sturdy. Dimensions: 48\" x 24\" x 18\". Perfect centerpiece for any living room.",
      "price": 150,
      "condition": "Good",
      "category": "Home & Garden",
      "category_id": 4,
      "seller": "HomeDesigner",
      "seller_id": 4,
      "location": "Portland, OR",
      "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
      "images": ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"],
      "status": "active",
      "created_at": "2024-08-22T11:45:00Z"
    },
    {
      "id": 5,
      "title": "Professional Yoga Mat Set",
      "description": "High-quality yoga mat with carrying bag and blocks. Non-slip surface, eco-friendly materials. Used only a few times, essentially like new. Includes yoga blocks, carrying strap, and instructional guide.",
      "price": 35,
      "condition": "Like New",
      "category": "Sports",
      "category_id": 5,
      "seller": "YogaEnthusiast",
      "seller_id": 5,
      "location": "Denver, CO",
      "image": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=300&h=300&fit=crop",
      "images": ["https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=300&h=300&fit=crop"],
      "status": "active",
      "created_at": "2024-08-20T14:20:00Z"
    },
    {
      "id": 6,
      "title": "LEGO Architecture Statue of Liberty",
      "description": "Brand new LEGO Architecture set, still in sealed box. Perfect for collectors or architecture enthusiasts. Contains 1685 pieces and detailed instruction booklet. Retail value $119, selling for less.",
      "price": 85,
      "condition": "New",
      "category": "Toys",
      "category_id": 6,
      "seller": "LegoCollector",
      "seller_id": 6,
      "location": "Chicago, IL",
      "image": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
      "images": ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop"],
      "status": "active",
      "created_at": "2024-08-18T16:10:00Z"
    }
  ],
  users: [
    {
      "id": 1,
      "username": "EcoWarrior2024",
      "email": "user@ecofinds.com",
      "location": "San Francisco, CA",
      "phone": "(555) 123-4567",
      "profile_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      "joined": "2024-03-15",
      "rating": 4.8,
      "total_listings": 12,
      "total_purchases": 8,
      "items_saved_from_waste": 156
    }
  ],
  purchase_history: [
    {
      "id": 1,
      "product_title": "MacBook Pro 2019 - 16 inch",
      "price": 1200,
      "purchase_date": "2024-08-15T10:30:00Z",
      "seller": "TechDeals",
      "status": "completed"
    },
    {
      "id": 2,
      "product_title": "Designer Handbag - Coach",
      "price": 350,
      "purchase_date": "2024-07-22T14:15:00Z",
      "seller": "LuxuryFinds",
      "status": "completed"
    },
    {
      "id": 3,
      "product_title": "Electric Guitar - Fender",
      "price": 450,
      "purchase_date": "2024-06-10T09:45:00Z",
      "seller": "MusicStore",
      "status": "completed"
    }
  ],
  sustainability_stats: {
    "total_items_reused": 1247,
    "co2_saved_kg": 2156,
    "waste_diverted_kg": 3421,
    "community_members": 5678
  }
};

// Global functions that need to be accessible from HTML onclick handlers
window.showView = showView;
window.showAuthModal = showAuthModal;
window.hideAuthModal = hideAuthModal;
window.showAuthForm = showAuthForm;
window.showProductDetail = showProductDetail;
window.hideProductModal = hideProductModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.showCart = showCart;
window.checkout = checkout;
window.logout = logout;
window.filterByCategory = filterByCategory;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.showEditProductModal = showEditProductModal;
window.hideEditProductModal = hideEditProductModal;
window.resetProductForm = resetProductForm;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  renderSustainabilityStats();
  renderCategories();
  renderProducts();
  populateCategoryFilters();
  setupNavigation();
  updateCartCount();
  updateUserInterface();
}

function setupEventListeners() {
  // Global search
  const globalSearch = document.getElementById('global-search');
  if (globalSearch) {
    globalSearch.addEventListener('input', function() {
      appState.searchTerm = this.value;
      filterAndRenderProducts();
    });
    
    globalSearch.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        filterAndRenderProducts();
      }
    });
  }

  // Filter listeners
  const categoryFilter = document.getElementById('category-filter');
  const conditionFilter = document.getElementById('condition-filter');
  const priceFilter = document.getElementById('price-filter');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      appState.filters.category = this.value;
      filterAndRenderProducts();
    });
  }

  if (conditionFilter) {
    conditionFilter.addEventListener('change', function() {
      appState.filters.condition = this.value;
      filterAndRenderProducts();
    });
  }

  if (priceFilter) {
    priceFilter.addEventListener('change', function() {
      appState.filters.priceRange = this.value;
      filterAndRenderProducts();
    });
  }

  // Form submissions
  const authForm = document.getElementById('auth-form');
  const productForm = document.getElementById('product-form');
  const editProductForm = document.getElementById('edit-product-form');
  const profileForm = document.getElementById('profile-form');

  if (authForm) {
    authForm.addEventListener('submit', handleAuthSubmit);
  }

  if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
  }

  if (editProductForm) {
    editProductForm.addEventListener('submit', handleEditProductSubmit);
  }

  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSubmit);
  }

  // Image upload
  const imagePreview = document.getElementById('image-preview');
  const productImage = document.getElementById('product-image');

  if (imagePreview && productImage) {
    imagePreview.addEventListener('click', () => productImage.click());
    productImage.addEventListener('change', handleImageUpload);
  }

  // Profile navigation
  setupProfileNavigation();
}

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const targetView = this.getAttribute('data-view');
      showView(targetView);
    });
  });
}

function setupProfileNavigation() {
  const profileNavItems = document.querySelectorAll('.profile-nav-item');
  
  profileNavItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const targetView = this.getAttribute('data-profile-view');
      showProfileView(targetView);
    });
  });
}

function showView(viewName) {
  console.log('Switching to view:', viewName);
  
  // Update navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const navItem = document.querySelector(`[data-view="${viewName}"]`);
  if (navItem) {
    navItem.classList.add('active');
  }

  // Update views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(`${viewName}-view`);
  if (targetView) {
    targetView.classList.add('active');
  }
  
  appState.currentView = viewName;

  // Render view-specific content
  if (viewName === 'my-listings') {
    if (!appState.isAuthenticated) {
      showAuthModal();
      showView('home');
      return;
    }
    renderMyListings();
  } else if (viewName === 'cart') {
    renderCart();
  } else if (viewName === 'profile') {
    if (!appState.isAuthenticated) {
      showAuthModal();
      showView('home');
      return;
    }
    renderProfile();
  } else if (viewName === 'add-product') {
    if (!appState.isAuthenticated) {
      showAuthModal();
      showView('home');
      return;
    }
  }
}

function showProfileView(viewName) {
  document.querySelectorAll('.profile-nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const navItem = document.querySelector(`[data-profile-view="${viewName}"]`);
  if (navItem) {
    navItem.classList.add('active');
  }

  document.querySelectorAll('.profile-view').forEach(view => {
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(`profile-${viewName}-view`);
  if (targetView) {
    targetView.classList.add('active');
  }

  if (viewName === 'purchases') {
    renderPurchaseHistory();
  }
}

function renderSustainabilityStats() {
  const stats = appData.sustainability_stats;
  const itemsElement = document.getElementById('items-reused');
  const co2Element = document.getElementById('co2-saved');
  const membersElement = document.getElementById('community-members');
  
  if (itemsElement) itemsElement.textContent = stats.total_items_reused.toLocaleString();
  if (co2Element) co2Element.textContent = stats.co2_saved_kg.toLocaleString();
  if (membersElement) membersElement.textContent = stats.community_members.toLocaleString();
}

function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  container.innerHTML = appData.categories.map(category => `
    <div class="category-card" onclick="filterByCategory(${category.id})">
      <div class="category-icon">${category.icon}</div>
      <div class="category-name">${category.name}</div>
      <div class="category-count">${category.count} items</div>
    </div>
  `).join('');
}

function populateCategoryFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const productCategorySelect = document.getElementById('product-category');
  
  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
      appData.categories.map(cat => 
        `<option value="${cat.name}">${cat.name}</option>`
      ).join('');
  }

  if (productCategorySelect) {
    productCategorySelect.innerHTML = '<option value="">Select Category</option>' +
      appData.categories.map(cat => 
        `<option value="${cat.name}" data-id="${cat.id}">${cat.name}</option>`
      ).join('');
  }
}

function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const products = getFilteredProducts();
  console.log('Rendering products:', products.length);
  
  if (products.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="grid-column: 1 / -1; padding: 2rem;">
        <p>No products found matching your criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => `
    <div class="product-card" onclick="showProductDetail(${product.id})">
      <div class="product-image">
        ${product.image ? `<img src="${product.image}" alt="${product.title}">` : '📦'}
      </div>
      <div class="product-info">
        <div class="product-title">${product.title}</div>
        <div class="product-price">$${product.price}</div>
        <div class="product-meta">
          <span class="product-condition">${product.condition}</span>
          <span class="product-location"><i class="fas fa-map-marker-alt"></i> ${product.location}</span>
        </div>
        <div class="product-seller">Sold by ${product.seller}</div>
        <div class="product-actions">
          <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderMyListings() {
  const container = document.getElementById('my-listings-grid');
  if (!container) return;

  if (!appState.isAuthenticated) {
    container.innerHTML = `
      <div class="text-center">
        <p>Please log in to view your listings.</p>
      </div>
    `;
    return;
  }

  const userListings = appData.products.filter(p => p.seller_id === appState.currentUser.id);
  
  if (userListings.length === 0) {
    container.innerHTML = `
      <div class="text-center">
        <p>You haven't listed any items yet.</p>
        <button class="btn btn--primary" onclick="showView('add-product')">List Your First Item</button>
      </div>
    `;
    return;
  }

  container.innerHTML = userListings.map(product => `
    <div class="product-card">
      <div class="product-image">
        ${product.image ? `<img src="${product.image}" alt="${product.title}">` : '📦'}
      </div>
      <div class="product-info">
        <div class="product-title">${product.title}</div>
        <div class="product-price">$${product.price}</div>
        <div class="product-meta">
          <span class="product-condition">${product.condition}</span>
          <span class="status ${product.status}">${product.status}</span>
        </div>
        <div class="listing-actions">
          <button class="edit-btn" onclick="editProduct(${product.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="delete-btn" onclick="deleteProduct(${product.id})">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCart() {
  const container = document.getElementById('cart-content');
  if (!container) return;

  if (appState.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-cart" style="font-size: 4rem; margin-bottom: 1rem; color: var(--color-text-secondary);"></i>
        <h3>Your cart is empty</h3>
        <p>Start shopping for sustainable treasures!</p>
        <button class="btn btn--primary" onclick="showView('home')">Browse Products</button>
      </div>
    `;
    return;
  }

  const cartItems = appState.cart.map(cartItem => {
    const product = appData.products.find(p => p.id === cartItem.productId);
    return { ...product, cartId: cartItem.id };
  });

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  container.innerHTML = `
    <div class="cart-items">
      ${cartItems.map(item => `
        <div class="cart-item">
          <div class="cart-item-image">
            ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '📦'}
          </div>
          <div class="cart-item-info">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">$${item.price}</div>
            <div class="cart-item-seller">Sold by ${item.seller}</div>
          </div>
          <div class="cart-item-actions">
            <button class="remove-btn" onclick="removeFromCart(${item.cartId})">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      <div class="cart-total">
        <span>Total: $${total.toFixed(2)}</span>
      </div>
      <button class="checkout-btn" onclick="checkout()">
        <i class="fas fa-credit-card"></i> Checkout
      </button>
    </div>
  `;
}

function renderProfile() {
  if (!appState.isAuthenticated) return;

  const user = appState.currentUser;
  
  // Update profile display
  const elements = {
    'profile-username': user.username,
    'profile-username-input': user.username,
    'profile-email': user.email,
    'profile-location': user.location,
    'profile-phone': user.phone
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      if (element.tagName === 'INPUT') {
        element.value = value;
      } else {
        element.textContent = value;
      }
    }
  });
}

function renderPurchaseHistory() {
  const container = document.getElementById('purchase-history');
  if (!container) return;

  container.innerHTML = appData.purchase_history.map(purchase => `
    <div class="purchase-item">
      <div class="purchase-info">
        <h4>${purchase.product_title}</h4>
        <div class="purchase-meta">
          Purchased from ${purchase.seller} • ${formatDate(purchase.purchase_date)}
        </div>
      </div>
      <div class="purchase-price">$${purchase.price}</div>
    </div>
  `).join('');
}

function getFilteredProducts() {
  let filtered = appData.products.filter(p => p.status === 'active');

  // Apply search term
  if (appState.searchTerm) {
    const term = appState.searchTerm.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  // Apply category filter
  if (appState.filters.category) {
    filtered = filtered.filter(p => p.category === appState.filters.category);
  }

  // Apply condition filter
  if (appState.filters.condition) {
    filtered = filtered.filter(p => p.condition === appState.filters.condition);
  }

  // Apply price range filter
  if (appState.filters.priceRange) {
    const [min, max] = appState.filters.priceRange.split('-').map(x => 
      x.includes('+') ? Infinity : parseInt(x)
    );
    filtered = filtered.filter(p => {
      if (max === undefined) return p.price >= min;
      return p.price >= min && p.price <= max;
    });
  }

  return filtered;
}

function filterAndRenderProducts() {
  renderProducts();
}

function filterByCategory(categoryId) {
  const category = appData.categories.find(c => c.id === categoryId);
  if (category) {
    appState.filters.category = category.name;
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.value = category.name;
    }
    filterAndRenderProducts();
  }
}

// Authentication functions
function showAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function hideAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function showAuthForm(formType) {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });
  
  const activeTab = document.querySelector(`[onclick="showAuthForm('${formType}')"]`);
  const activeForm = document.getElementById(`${formType}-form`);
  
  if (activeTab) activeTab.classList.add('active');
  if (activeForm) activeForm.classList.add('active');
  
  const modalTitle = document.getElementById('auth-modal-title');
  if (modalTitle) {
    modalTitle.textContent = formType === 'login' ? 'Welcome Back' : 'Join EcoFinds';
  }
}

function handleAuthSubmit(e) {
  e.preventDefault();
  
  const activeForm = document.querySelector('.auth-form.active');
  const isLogin = activeForm && activeForm.id === 'login-form';
  
  if (isLogin) {
    // Simulate login
    appState.isAuthenticated = true;
    appState.currentUser = appData.users[0]; // Use demo user
    updateUserInterface();
    showToast('Login successful! Welcome back to EcoFinds.', 'success');
  } else {
    // Simulate registration
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    
    const newUser = {
      id: Date.now(),
      username: username,
      email: email,
      location: '',
      phone: '',
      profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      joined: new Date().toISOString().split('T')[0],
      rating: 5.0,
      total_listings: 0,
      total_purchases: 0,
      items_saved_from_waste: 0
    };
    
    appData.users.push(newUser);
    appState.isAuthenticated = true;
    appState.currentUser = newUser;
    updateUserInterface();
    showToast('Account created successfully! Welcome to EcoFinds.', 'success');
  }
  
  hideAuthModal();
}

function updateUserInterface() {
  const userMenu = document.getElementById('user-menu');
  
  if (appState.isAuthenticated && appState.currentUser) {
    userMenu.innerHTML = `
      <div class="user-info">
        <img src="${appState.currentUser.profile_image}" alt="${appState.currentUser.username}" class="user-avatar">
        <span>${appState.currentUser.username}</span>
        <button onclick="logout()" class="btn btn--secondary btn--sm">Logout</button>
      </div>
    `;
  } else {
    userMenu.innerHTML = `
      <button class="login-btn" onclick="showAuthModal()">Login</button>
    `;
  }
}

function logout() {
  appState.isAuthenticated = false;
  appState.currentUser = null;
  appState.cart = [];
  updateUserInterface();
  updateCartCount();
  showView('home');
  showToast('You have been logged out successfully.', 'success');
}

// Product management functions
function showProductDetail(productId) {
  const product = appData.products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  const container = document.getElementById('product-detail');
  
  if (container) {
    container.innerHTML = `
      <div class="product-detail-image">
        ${product.image ? `<img src="${product.image}" alt="${product.title}">` : '📦'}
      </div>
      <div class="product-detail-info">
        <h3>${product.title}</h3>
        <div class="product-detail-price">$${product.price}</div>
        <div class="product-detail-meta">
          <div class="meta-item">
            <span class="meta-label">Condition:</span>
            <span>${product.condition}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Category:</span>
            <span>${product.category}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Location:</span>
            <span>${product.location}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Seller:</span>
            <span>${product.seller}</span>
          </div>
        </div>
        <div class="product-detail-description">
          <h4>Description</h4>
          <p>${product.description}</p>
        </div>
        <div class="product-detail-actions">
          <button class="btn btn--primary" onclick="addToCart(${product.id}); hideProductModal()">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="btn btn--secondary" onclick="hideProductModal()">Close</button>
        </div>
      </div>
    `;
  }
  
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function hideProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function handleProductSubmit(e) {
  e.preventDefault();
  
  if (!appState.isAuthenticated) {
    showToast('Please log in to list items.', 'error');
    showAuthModal();
    return;
  }
  
  const title = document.getElementById('product-title').value;
  const description = document.getElementById('product-description').value;
  const categorySelect = document.getElementById('product-category');
  const category = categorySelect.value;
  const categoryOption = categorySelect.selectedOptions[0];
  const categoryId = categoryOption ? parseInt(categoryOption.dataset.id) : 1;
  const condition = document.getElementById('product-condition').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const location = document.getElementById('product-location').value;
  
  const newProduct = {
    id: Date.now(),
    title,
    description,
    price,
    condition,
    category,
    category_id: categoryId,
    seller: appState.currentUser.username,
    seller_id: appState.currentUser.id,
    location,
    image: null, // In a real app, this would be uploaded
    images: [],
    status: 'active',
    created_at: new Date().toISOString()
  };
  
  appData.products.push(newProduct);
  renderProducts();
  resetProductForm();
  showToast('Product listed successfully!', 'success');
  showView('my-listings');
}

function resetProductForm() {
  const form = document.getElementById('product-form');
  if (form) {
    form.reset();
  }
  
  const imagePreview = document.getElementById('image-preview');
  if (imagePreview) {
    imagePreview.innerHTML = `
      <i class="fas fa-image"></i>
      <span>Click to add image</span>
    `;
  }
}

function editProduct(productId) {
  const product = appData.products.find(p => p.id === productId);
  if (!product) return;
  
  appState.editingProduct = product;
  
  // Populate edit form
  const elements = {
    'edit-product-title': product.title,
    'edit-product-description': product.description,
    'edit-product-price': product.price,
    'edit-product-condition': product.condition
  };
  
  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.value = value;
    }
  });
  
  showEditProductModal();
}

function showEditProductModal() {
  const modal = document.getElementById('edit-product-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function hideEditProductModal() {
  const modal = document.getElementById('edit-product-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
  appState.editingProduct = null;
}

function handleEditProductSubmit(e) {
  e.preventDefault();
  
  if (!appState.editingProduct) return;
  
  const productIndex = appData.products.findIndex(p => p.id === appState.editingProduct.id);
  
  if (productIndex > -1) {
    appData.products[productIndex] = {
      ...appData.products[productIndex],
      title: document.getElementById('edit-product-title').value,
      description: document.getElementById('edit-product-description').value,
      price: parseFloat(document.getElementById('edit-product-price').value),
      condition: document.getElementById('edit-product-condition').value
    };
  }
  
  renderMyListings();
  renderProducts();
  hideEditProductModal();
  showToast('Product updated successfully!', 'success');
}

function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this listing?')) return;
  
  const index = appData.products.findIndex(p => p.id === productId);
  if (index > -1) {
    appData.products.splice(index, 1);
    renderMyListings();
    renderProducts();
    showToast('Product deleted successfully!', 'success');
  }
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview) {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    }
  };
  reader.readAsDataURL(file);
}

// Cart functions
function addToCart(productId) {
  const product = appData.products.find(p => p.id === productId);
  if (!product) return;
  
  // Check if already in cart
  const existingItem = appState.cart.find(item => item.productId === productId);
  if (existingItem) {
    showToast('Item is already in your cart!', 'error');
    return;
  }
  
  appState.cart.push({
    id: Date.now(),
    productId: productId,
    addedAt: new Date()
  });
  
  updateCartCount();
  showToast(`${product.title} added to cart!`, 'success');
}

function removeFromCart(cartId) {
  appState.cart = appState.cart.filter(item => item.id !== cartId);
  updateCartCount();
  renderCart();
  showToast('Item removed from cart.', 'success');
}

function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = appState.cart.length;
  }
}

function showCart() {
  showView('cart');
}

function checkout() {
  if (!appState.isAuthenticated) {
    showToast('Please log in to complete your purchase.', 'error');
    showAuthModal();
    return;
  }
  
  if (appState.cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  
  // Simulate purchase
  const cartItems = appState.cart.map(cartItem => {
    const product = appData.products.find(p => p.id === cartItem.productId);
    return {
      id: Date.now() + Math.random(),
      product_title: product.title,
      price: product.price,
      purchase_date: new Date().toISOString(),
      seller: product.seller,
      status: 'completed'
    };
  });
  
  appData.purchase_history.push(...cartItems);
  
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const itemCount = cartItems.length;
  
  appState.cart = [];
  updateCartCount();
  renderCart();
  
  showToast(`Purchase completed! ${itemCount} items bought for $${total.toFixed(2)}`, 'success');
}

// Profile functions
function handleProfileSubmit(e) {
  e.preventDefault();
  
  if (!appState.isAuthenticated) return;
  
  appState.currentUser.username = document.getElementById('profile-username-input').value;
  appState.currentUser.email = document.getElementById('profile-email').value;
  appState.currentUser.location = document.getElementById('profile-location').value;
  appState.currentUser.phone = document.getElementById('profile-phone').value;
  
  updateUserInterface();
  showToast('Profile updated successfully!', 'success');
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'fa-check-circle' : 
               type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  
  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  document.body.appendChild(toast);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 5000);
}