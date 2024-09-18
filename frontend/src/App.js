import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Conditionally redirect "/" based on login status */}
        <Route
          path="/"
          element={token ? <Navigate to="/products" /> : <Navigate to="/login" />}
        />

        {/* Standard Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/products" element={<ProductList token={token} />} />
        <Route path="/cart" element={<ProtectedRoute element={<Cart token={token} />} />} />
        <Route path="/checkout" element={<ProtectedRoute element={<Checkout token={token} />} />} />
      </Routes>
    </Router>
  );
};

export default App;