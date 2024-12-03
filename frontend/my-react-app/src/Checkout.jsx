import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ shippingInfo, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { clearCart } = useCart();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:3000/api/orders',
                {
                    shippingAddress: shippingInfo
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const { clientSecret, orderId } = response.data;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        address: {
                            city: shippingInfo.city,
                            country: shippingInfo.country,
                            line1: shippingInfo.street,
                            postal_code: shippingInfo.postalCode,
                            state: shippingInfo.state
                        }
                    }
                }
            });

            if (result.error) {
                setError(result.error.message);
                onError(result.error.message);
            } else {
                clearCart();
                onSuccess(orderId);
            }
        } catch (err) {
            setError(err.message);
            onError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="card-element-container">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button 
                type="submit" 
                disabled={!stripe || loading}
                className="payment-button"
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

function Checkout() {
    const navigate = useNavigate();
    const { cart } = useCart();
    const [shippingInfo, setShippingInfo] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePaymentSuccess = (orderId) => {
        try {
            navigate(`/order-confirmation/${orderId}`);
        } catch (error) {
            console.error('Error navigating to order confirmation:', error);
        }
    };

    const handlePaymentError = (error) => {
        console.error('Payment error:', error);
    };

    const stripeElementsOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            
            <div className="shipping-form">
                <h2>Shipping Information</h2>
                <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={shippingInfo.street}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                />
            </div>

            <div className="payment-form">
                <h2>Payment Information</h2>
                <Elements stripe={stripePromise} options={stripeElementsOptions}>
                    <PaymentForm
                        shippingInfo={shippingInfo}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                    />
                </Elements>
            </div>
        </div>
    );
}

export default Checkout;