import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        window.location.href = '/';
    };

    return (
        <nav>
            <ul>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                {!token ? (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                ) : (
                    <>
                        <li>Hello, {username}!</li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
