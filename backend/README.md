# EcoFinds Backend API

## Setup Instructions

1. Install dependencies:

2. Start the server:
or for development with auto-restart:

3. Server will run on: http://localhost:5000

## Test the API

### Health Check
GET http://localhost:5000/api/health

### Test User Login
POST http://localhost:5000/api/auth/login

### Get Products
GET http://localhost:5000/api/products

## API Endpoints

- **GET /api/health** - Server status
- **POST /api/auth/register** - User registration
- **POST /api/auth/login** - User login
- **GET /api/products** - Get all products
- **POST /api/products** - Create product (auth required)
- **GET /api/categories** - Get categories
- **GET /api/cart** - Get cart items (auth required)
- **POST /api/cart** - Add to cart (auth required)

## Database

Uses SQLite database (`ecofinds.db`) with sample data included.


