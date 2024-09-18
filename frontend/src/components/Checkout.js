import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutForm.css'; 
import axiosInstance from './axiosInstance'; 

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ token }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;
        setLoading(true);

        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('http://127.0.0.1:8000/checkout/', {
                payment_method_id: paymentMethod.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { client_secret } = response.data;

            const confirmResult = await stripe.confirmCardPayment(client_secret);

            if (confirmResult.error) {
                setError(confirmResult.error.message);
            } else {
                setSuccess(true);
                alert(`Order placed successfully! Order ID: ${response.data.order_id}`);
            }
        } catch (error) {
            setError('Error processing payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Checkout</h2>
            <div className="form-row">
                <CardElement className="card-element" />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading} className={`submit-button ${loading ? 'loading' : ''}`}>
                {loading ? 'Processing...' : 'Pay'}
            </button>
            {success && <div className="success-message">Payment successful! Thank you for your purchase.</div>}
        </form>
    );
};

const Checkout = ({ token }) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm token={token} />
    </Elements>
);

export default Checkout;
