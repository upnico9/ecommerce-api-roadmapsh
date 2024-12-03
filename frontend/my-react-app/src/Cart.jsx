import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { TrashIcon } from '@heroicons/react/24/solid';

function Cart() {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateCartQuantity, clearCart, loading } = useCart();

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }

    const cartItems = Array.isArray(cart) ? cart : [];
    console.log('Cart items:', cartItems);

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <button 
                onClick={() => navigate('/products')} 
                className="continue-shopping"
              >
                Continue Shopping
              </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item._id} className="cart-item">
                            <div className="item-image">
                                <div className="placeholder-image">
                                    {item.product.name[0]}
                                </div>
                            </div>
                            <div className="item-details">
                                <h3>{item.product.name}</h3>
                                <p className="item-price">Price: ${item.product.price}</p>
                            </div>
                            <div className="item-quantity">
                                <button onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}>+</button>
                            </div>
                            <div className="item-total">
                                <p>Total: ${item.product.price * item.quantity}</p>
                            </div>
                            <div className="item-remove">
                                <button onClick={() => removeFromCart(item.product._id)}>
                                <TrashIcon className='trash-icon' />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-details">
                        <div className="summary-row">
                            <p>Subtotal</p>
                            <p>${calculateTotal().toFixed(2)}</p>
                        </div>
                        <div className="summary-row">
                            <p>Shipping</p>
                            <p>$0.00</p>
                        </div>
                        <div className="summary-total">
                            <p>Total</p>
                            <p>${calculateTotal().toFixed(2)}</p>
                        </div>
                        <button className="checkout-button" onClick={() => navigate('/checkout')} disabled={cart.length === 0}>Checkout</button>
                        <button className="clear-cart-button" onClick={clearCart}>Clear Cart</button>
                        <button className="continue-shopping-link" onClick={() => navigate('/products')}>Continue Shopping</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;