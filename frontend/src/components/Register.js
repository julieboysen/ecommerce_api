import React, { useState } from 'react';
import './Register.css'; // Import the CSS file
import axiosInstance from './axiosInstance'; // Use axiosInstance

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent form submission
      
        try {
          const response = await axiosInstance.post('http://127.0.0.1:8000/register/', formData);
          
          // Store token and username in localStorage
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('username', formData.username);

          // Optionally, redirect user after registration
          window.location.href = '/';
        } catch (error) {
          console.error('Registration failed', error);
          setError('Registration failed. Please try again.');
        }
      };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Register</h2>
                <form onSubmit={handleRegister} className="register-form">
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        onChange={handleInputChange}
                        required
                        className="register-input"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleInputChange}
                        required
                        className="register-input"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleInputChange}
                        required
                        className="register-input"
                    />
                    <button type="submit" className="register-button">Register</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;
