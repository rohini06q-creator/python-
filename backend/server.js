const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'ecofinds.db');
const db = new sqlite3.Database(dbPath);

// Create tables and seed data
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        location TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        icon TEXT,
        description TEXT
    )`);

    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        condition TEXT DEFAULT 'GOOD',
        category TEXT NOT NULL,
        seller_id INTEGER,
        image_url TEXT,
        status TEXT DEFAULT 'ACTIVE',
        views INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users (id)
    )`);

    // Cart table
    db.run(`CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id),
        UNIQUE(user_id, product_id)
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        buyer_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'PENDING',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES users (id)
    )`);

    // Purchase History table
    db.run(`CREATE TABLE IF NOT EXISTS purchase_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        buyer_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        amount_paid REAL NOT NULL,
        FOREIGN KEY (buyer_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    )`);

    // Insert sample categories
    const categories = [
        ['Electronics', '📱', 'Phones, laptops, gadgets'],
        ['Clothing', '👕', 'Fashion and apparel'],
        ['Books', '📚', 'Books and educational materials'],
        ['Home & Garden', '🏠', 'Furniture and home decor'],
        ['Sports', '⚽', 'Sports and fitness equipment'],
        ['Toys', '🧸', 'Kids toys and games']
    ];

    const insertCategory = db.prepare(`INSERT OR IGNORE INTO categories (name, icon, description) VALUES (?, ?, ?)`);
    categories.forEach(cat => insertCategory.run(cat));
    insertCategory.finalize();

    // Insert sample products
    const sampleProducts = [
        ['iPhone 13 Pro - Excellent Condition', 'Barely used iPhone 13 Pro in pristine condition. Comes with original box, charger, and screen protector already applied. Battery health at 98%.', 799.99, 'LIKE_NEW', 'Electronics', 1, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop'],
        ['Vintage Leather Jacket - Medium', 'Authentic vintage leather jacket from the 90s. Genuine leather with beautiful aging. Perfect for fall and winter.', 89.50, 'GOOD', 'Clothing', 1, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop'],
        ['Complete Harry Potter Book Set', 'Complete collection of all 7 Harry Potter books in paperback. Books are in good condition with minimal wear.', 45.00, 'GOOD', 'Books', 1, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop'],
        ['Modern Coffee Table - Oak Wood', 'Beautiful oak coffee table with modern design. Minor scratches but very sturdy. Dimensions: 48" x 24" x 18".', 150.00, 'GOOD', 'Home & Garden', 1, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop'],
        ['Professional Yoga Mat Set', 'High-quality yoga mat with carrying bag and blocks. Non-slip surface, eco-friendly materials. Used only a few times.', 35.00, 'LIKE_NEW', 'Sports', 1, 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=300&h=300&fit=crop'],
        ['LEGO Architecture Statue of Liberty', 'Brand new LEGO Architecture set, still in sealed box. Perfect for collectors or architecture enthusiasts.', 85.00, 'NEW', 'Toys', 1, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop']
    ];

    const insertProduct = db.prepare(`INSERT OR IGNORE INTO products (title, description, price, condition, category, seller_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    sampleProducts.forEach(product => insertProduct.run(product));
    insertProduct.finalize();

    // Create a default user for testing
    const defaultPassword = bcrypt.hashSync('password123', 10);
    db.run(`INSERT OR IGNORE INTO users (email, username, password, location) VALUES (?, ?, ?, ?)`,
        ['demo@ecofinds.com', 'demouser', defaultPassword, 'San Francisco, CA']);
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// ============================
// ROUTES
// ============================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: '🌱 EcoFinds Backend is running successfully!',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'SQLite',
        endpoints: {
            auth: '/api/auth/*',
            products: '/api/products/*',
            categories: '/api/categories',
            cart: '/api/cart/*'
        }
    });
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, username, password, location, phone } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ success: false, message: 'Email, username, and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (email, username, password, location, phone) VALUES (?, ?, ?, ?, ?)`,
            [email, username, hashedPassword, location || null, phone || null],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({ success: false, message: 'Email or username already exists' });
                    }
                    return res.status(500).json({ success: false, message: 'Registration failed' });
                }

                const token = jwt.sign({ userId: this.lastID, email, username }, process.env.JWT_SECRET, { expiresIn: '7d' });

                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    data: {
                        user: { id: this.lastID, email, username, location, phone },
                        token
                    }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
            if (err || !user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: { 
                        id: user.id, 
                        email: user.email, 
                        username: user.username, 
                        location: user.location,
                        phone: user.phone 
                    },
                    token
                }
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// Get User Profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
    db.get(`SELECT id, email, username, location, phone, created_at FROM users WHERE id = ?`, [req.user.userId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            data: { user }
        });
    });
});

// Get All Products
app.get('/api/products', (req, res) => {
    const { search, category, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    
    let sql = `SELECT p.*, u.username as seller_username FROM products p LEFT JOIN users u ON p.seller_id = u.id WHERE p.status = 'ACTIVE'`;
    let params = [];

    if (search) {
        sql += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    if (category && category !== '') {
        sql += ` AND p.category = ?`;
        params.push(category);
    }

    sql += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    db.all(sql, params, (err, products) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to fetch products' });
        }

        // Get total count for pagination
        let countSql = `SELECT COUNT(*) as total FROM products WHERE status = 'ACTIVE'`;
        let countParams = [];
        
        if (search) {
            countSql += ` AND (title LIKE ? OR description LIKE ?)`;
            countParams.push(`%${search}%`, `%${search}%`);
        }
        
        if (category && category !== '') {
            countSql += ` AND category = ?`;
            countParams.push(category);
        }

        db.get(countSql, countParams, (err, countResult) => {
            const total = countResult ? countResult.total : 0;
            const totalPages = Math.ceil(total / limit);

            res.json({
                success: true,
                data: {
                    products,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        pages: totalPages,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    }
                }
            });
        });
    });
});

// Get Single Product
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    // Update view count
    db.run(`UPDATE products SET views = views + 1 WHERE id = ?`, [productId]);

    db.get(`
        SELECT p.*, u.username as seller_username, u.location as seller_location 
        FROM products p 
        LEFT JOIN users u ON p.seller_id = u.id 
        WHERE p.id = ?
    `, [productId], (err, product) => {
        if (err || !product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({
            success: true,
            data: { product }
        });
    });
});

// Create Product
app.post('/api/products', authenticateToken, (req, res) => {
    const { title, description, price, condition, category, image_url } = req.body;

    if (!title || !description || !price || !category) {
        return res.status(400).json({ success: false, message: 'Title, description, price, and category are required' });
    }

    db.run(
        `INSERT INTO products (title, description, price, condition, category, seller_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, description, price, condition || 'GOOD', category, req.user.userId, image_url || null],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to create product' });
            }

            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: {
                    product: {
                        id: this.lastID,
                        title,
                        description,
                        price,
                        condition: condition || 'GOOD',
                        category,
                        image_url
                    }
                }
            });
        }
    );
});

// Get User's Products
app.get('/api/products/user/listings', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC`, [req.user.userId], (err, products) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to fetch your products' });
        }

        res.json({
            success: true,
            data: { products }
        });
    });
});

// Update Product
app.put('/api/products/:id', authenticateToken, (req, res) => {
    const { title, description, price, condition, category, image_url } = req.body;
    const productId = req.params.id;

    // Check if product belongs to user
    db.get(`SELECT seller_id FROM products WHERE id = ?`, [productId], (err, product) => {
        if (err || !product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.seller_id !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
        }

        db.run(
            `UPDATE products SET title = ?, description = ?, price = ?, condition = ?, category = ?, image_url = ? WHERE id = ?`,
            [title, description, price, condition, category, image_url, productId],
            function(err) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Failed to update product' });
                }

                res.json({
                    success: true,
                    message: 'Product updated successfully'
                });
            }
        );
    });
});

// Delete Product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
    const productId = req.params.id;

    // Check if product belongs to user
    db.get(`SELECT seller_id FROM products WHERE id = ?`, [productId], (err, product) => {
        if (err || !product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.seller_id !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
        }

        db.run(`DELETE FROM products WHERE id = ?`, [productId], function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to delete product' });
            }

            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        });
    });
});

// Get Categories
app.get('/api/categories', (req, res) => {
    db.all(`SELECT * FROM categories ORDER BY name`, (err, categories) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
        }

        res.json({
            success: true,
            data: { categories }
        });
    });
});

// Get Cart
app.get('/api/cart', authenticateToken, (req, res) => {
    db.all(`
        SELECT c.id, c.quantity, c.added_at, p.* 
        FROM cart_items c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ? AND p.status = 'ACTIVE'
        ORDER BY c.added_at DESC
    `, [req.user.userId], (err, items) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to fetch cart' });
        }

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.json({
            success: true,
            data: {
                items,
                summary: {
                    itemCount: items.length,
                    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
                    totalAmount: total
                }
            }
        });
    });
});

// Add to Cart
app.post('/api/cart', authenticateToken, (req, res) => {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Check if product exists and is not seller's own product
    db.get(`SELECT * FROM products WHERE id = ? AND status = 'ACTIVE'`, [productId], (err, product) => {
        if (err || !product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.seller_id === req.user.userId) {
            return res.status(400).json({ success: false, message: 'You cannot add your own product to cart' });
        }

        db.run(
            `INSERT OR REPLACE INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`,
            [req.user.userId, productId, quantity],
            function(err) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Failed to add item to cart' });
                }

                res.status(201).json({
                    success: true,
                    message: 'Item added to cart successfully'
                });
            }
        );
    });
});

// Remove from Cart
app.delete('/api/cart/:id', authenticateToken, (req, res) => {
    const cartItemId = req.params.id;

    db.run(`DELETE FROM cart_items WHERE id = ? AND user_id = ?`, [cartItemId, req.user.userId], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        res.json({
            success: true,
            message: 'Item removed from cart successfully'
        });
    });
});

// Get Purchase History
app.get('/api/orders/history', authenticateToken, (req, res) => {
    db.all(`
        SELECT ph.*, p.title as product_title, p.image_url 
        FROM purchase_history ph 
        JOIN products p ON ph.product_id = p.id 
        WHERE ph.buyer_id = ? 
        ORDER BY ph.purchase_date DESC
    `, [req.user.userId], (err, history) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to fetch purchase history' });
        }

        res.json({
            success: true,
            data: { purchases: history }
        });
    });
});

// Search Products
app.get('/api/products/search', (req, res) => {
    const { q: query } = req.query;

    if (!query || query.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
    }

    db.all(`
        SELECT p.*, u.username as seller_username 
        FROM products p 
        LEFT JOIN users u ON p.seller_id = u.id 
        WHERE p.status = 'ACTIVE' AND (p.title LIKE ? OR p.description LIKE ?) 
        ORDER BY p.created_at DESC 
        LIMIT 20
    `, [`%${query}%`, `%${query}%`], (err, products) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Search failed' });
        }

        res.json({
            success: true,
            data: {
                products,
                query: query.trim(),
                count: products.length
            }
        });
    });
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        availableEndpoints: {
            health: 'GET /api/health',
            auth: 'POST /api/auth/login, POST /api/auth/register',
            products: 'GET /api/products, POST /api/products',
            categories: 'GET /api/categories',
            cart: 'GET /api/cart, POST /api/cart'
        }
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT. Closing database connection...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed.');
        }
        process.exit(0);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('🌱 ================================');
    console.log('🚀 EcoFinds Backend Server Started!');
    console.log('🌱 ================================');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Database: SQLite (ecofinds.db)`);
    console.log(`🔑 Test User: demo@ecofinds.com / password123`);
    console.log('🌱 ================================');
});

module.exports = app;
