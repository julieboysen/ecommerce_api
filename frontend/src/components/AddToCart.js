import React, { useState } from 'react';
import axiosInstance from './axiosInstance'; 

const AddToCart = ({ productId, token, onStockUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addToCart = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post('http://127.0.0.1:8000/cart/', { product_id: productId, quantity: 1 }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Notify the parent component about the stock update
            onStockUpdate(response.data.stock_status);

            alert('Product added to cart');
        } catch (error) {
            setError(error.response?.data?.error || 'Error adding product to cart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={addToCart} disabled={loading}>
            {loading ? 'Adding...' : 'Add to Cart'}
            {error && <div className="error-message">{error}</div>}
        </button>
    );
};

export default AddToCart;