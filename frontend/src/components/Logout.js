import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove tokens from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Redirect to login
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;