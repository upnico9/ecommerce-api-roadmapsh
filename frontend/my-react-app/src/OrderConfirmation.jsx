import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderConfirmation() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:3000/api/orders/${orderId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setOrder(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!order) return <div>Order not found</div>;
    console.log(order);

    return (
        <div className="order-confirmation">
            <h1>Order Confirmed!</h1>
            <div className="order-details">
                <h2>Order #{order._id}</h2>
                <p>Thank you for your purchase!</p>
                
                <div className="shipping-details">
                    <h3>Shipping Information</h3>
                    <p>{order.user.email}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                </div>

                <div className="order-items">
                    <h3>Order Items</h3>
                    {order.items.map((item) => (
                        <div key={item.product._id} className="order-item">
                            <p>{item.product.name}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>${item.product.price * item.quantity}</p>
                        </div>
                    ))}
                </div>

                <div className="order-total">
                    <h3>Total: ${order.totalAmount}</h3>
                </div>

                <button 
                    onClick={() => navigate('/products')} 
                    className="continue-shopping"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}

export default OrderConfirmation;