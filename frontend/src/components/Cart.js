import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Cart.css'; 
import axiosInstance from './axiosInstance'; 

const Cart = ({ token }) => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate(); // To handle navigation

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosInstance.get('http://127.0.0.1:8000/cart/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const items = Array.isArray(response.data.cart_items) ? response.data.cart_items : [];
                setCartItems(items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [token]);

    const removeFromCart = async (productId) => {
        try {
            await axiosInstance.delete('http://127.0.0.1:8000/cart/', {
                data: { product_id: productId, quantity: 1 },
                headers: { Authorization: `Bearer ${token}` }
            });

            setCartItems(prevItems =>
                prevItems
                    .map(item =>
                        item.product.id === productId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    )
                    .filter(item => item.quantity > 0) // Remove item if quantity is zero
            );
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            <ul className="cart-items-list">
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <li key={item.product.id} className="cart-item">
                            <div className="cart-item-info">
                                <span className="cart-item-name">{item.product.name}</span>
                                <span className="cart-item-quantity">Quantity: {item.quantity}</span>
                            </div>
                            <button 
                                className="remove-button" 
                                onClick={() => removeFromCart(item.product.id)}
                            >
                                Remove
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No items in your cart</p>
                )}
            </ul>

            {/* Show the "Proceed to Checkout" button only if there are items in the cart */}
            {cartItems.length > 0 && (
                <button className="checkout-button" onClick={() => navigate('/checkout')}>
                    Proceed to Checkout
                </button>
            )}
        </div>
    );
};

export default Cart;
