import React, { useState, useEffect } from 'react';
import AddToCart from './AddToCart';
import './ProductList.css'; 
import axiosInstance from './axiosInstance'; 

const ProductList = ({ token }) => {
    const [products, setProducts] = useState([]);
    const [outOfStockProducts, setOutOfStockProducts] = useState(new Set());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('http://127.0.0.1:8000/products/');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleStockUpdate = (productId, status) => {
        if (status === 'out_of_stock') {
            setOutOfStockProducts(prev => new Set(prev).add(productId));
        }
    };

    return (
        <div className="product-list">
            {products.map(product => (
                <div key={product.id} className={`product-card ${outOfStockProducts.has(product.id) ? 'out-of-stock' : ''}`}>
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                    <AddToCart 
                        productId={product.id} 
                        token={token} 
                        onStockUpdate={(status) => handleStockUpdate(product.id, status)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductList;
    