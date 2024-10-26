
# E-Commerce API

## Overview

This project is a e-commerce platform built using Django for the backend and React for the frontend. It offers functionalities such as user authentication, product management, shopping cart operations, and integration with Stripe for payments.

## Features

- **User Registration & Authentication**: Users can register, log in, and authenticate using JWT tokens.
- **Product Management**: View and search products.
- **Shopping Cart**: Users can view, add, and remove products in their cart.
- **Checkout**: Users can proceed to checkout and pay for their cart using Stripe.
- **Admin Panel**: Admin users can manage users and products.

## Technology Stack

- **Backend Framework**: Django, Django Rest Framework
- **Frontend Framework**: React (JavaScript)
- **Database**: SQLite (can be switched to PostgreSQL or MySQL)
- **Authentication**: JWT (JSON Web Tokens) via `django-rest-framework-simplejwt`
- **Payments**: Stripe integration for secure payments
- **Environment Management**: `python-decouple` for handling environment variables

## Setup & Installation

### Prerequisites

- Python 3.8 or higher
- Django 4.x or higher
- Node.js (for React frontend)
- Stripe account (for payments)

### Backend Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/julieboysen/ecommerce_api.git
   cd ecommerce_api
   ```

2. **Create a virtual environment and activate it:**

   ```bash
   python3 -m venv env
   source env/bin/activate
   ```

3. **Install the dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the environment variables:**

   Create a `.env` file in the project root and add the following:

   ```env
   SECRET_KEY=your_django_secret_key
   STRIPE_API_KEY=your_stripe_secret_key
   DEBUG=True
   ```

5. **Apply migrations and create the database:**

   ```bash
   python manage.py migrate
   ```

6. **Create a superuser for admin access:**

   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server:**

   ```bash
   python manage.py runserver
   ```

### Frontend Installation

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables for the frontend:**

   Create a `.env` file in the `frontend/` directory and add your Stripe public key:

   ```env
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. **Start the React development server:**

   ```bash
   npm start
   ```

The frontend will be accessible at `http://localhost:3000`.

## API Endpoints

### Authentication

- **Register**: `POST /register/`
  - Request body: `username`, `email`, `password`
  - Response: JWT tokens (refresh and access)
  
- **Login**: `POST /login/`
  - Request body: `username`, `password`
  - Response: JWT tokens (refresh and access)

### Products

- **Get Products**: `GET /products/`
  - Retrieve all available products or search by query parameters (`?q=`).
  
- **Create/Edit/Delete Products (Admin Only)**: Admin users can create, update, or delete products via the Django admin panel or APIs.

### Shopping Cart

- **View Cart**: `GET /cart/`
  - View all items in the user's shopping cart.
  
- **Add to Cart**: `POST /cart/`
  - Request body: `product_id`, `quantity`
  - Adds a product to the cart or updates its quantity if it's already in the cart.

- **Remove from Cart**: `DELETE /cart/`
  - Request body: `product_id`
  - Removes one quantity of the specified product or removes it entirely if the quantity is 1.

- **Cart Total**: Automatically calculates the total value of the cart.

### Checkout

- **Checkout**: `POST /checkout/`
  - Calculates the total value of the cart and creates a Stripe payment intent for secure payment processing.
  - Request body: None (cart is automatically used).
  - Response: Stripe's `client_secret` for frontend processing of payment.

## Running Tests

Run the tests to ensure everything works correctly:

```bash
python manage.py test
```

## Stripe Integration

The project integrates Stripe for handling payments. To simulate a payment:

1. **Test mode**: Get your own Stripe test key by making a Stripe account and replacing the key in the `.env` file. Additionally, you use Stripe's test cards, such as `4242 4242 4242 4242`, and any valid future expiration date (e.g., `12/34`).
2. **Live mode**: Switch to live mode by replacing the Stripe test key with your live key in the `.env` file.

## Admin Panel

Django’s admin panel can be accessed at `/admin/` where products can be created, updated, and deleted by an admin user.

## Project Link

For more details about this project, visit the [E-Commerce API Project](https://roadmap.sh/projects/ecommerce-api).
