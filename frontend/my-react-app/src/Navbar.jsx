import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useCart } from './CartContext';

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const { cart, clearCart } = useCart();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user')) || {};


        setIsLoggedIn(!!token);
        setUser(user.email || '');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearCart();
        setIsLoggedIn(false);
        setUser('');
        setShowDropdown(false);
        navigate('/');
    }

    return (
        <nav className='navbar'>
            <div className='navbar-brand'>
                <Link to="/">Home</Link>
            </div>
            <div className='navbar-menu'>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
            </div>

            <div className="navbar-auth">
                <div className='cart-icon-container' onClick={() => navigate('/cart')}>
                    <ShoppingCartIcon className='cart-icon' />
                    {cart.length > 0 && (
                        <span className='cart-count'>{cart.length}</span>
                    )}
                </div>
                {isLoggedIn ? (
                    <div className='user-menu'>
                        <span className='welcome-text'>Welcome, {user}</span>
                        <div className="profile-dropdown">
                            <button 
                                className="profile-icon-button"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                            <UserCircleIcon className="user-icon" />
                            </button>
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <Link 
                                        to="/profile" 
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item logout"> Logout </button>
                                </div>
                            )}
                        </div>
                    </div> 
                ) : (
                    <>
                        <button onClick={() => navigate('/login')} className='auth-button login'>Login</button>
                        <button onClick={() => navigate('/register')} className='auth-button register'>Register</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;