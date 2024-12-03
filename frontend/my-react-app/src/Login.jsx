import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';

function Login() { 
    const navigate = useNavigate();
    const { syncCartWithServer } = useCart();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        if (error) setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        try { 
            const response = await axios.post('http://localhost:3000/api/users/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            debugger;
            await syncCartWithServer();
            debugger;
            navigate('/');
            window.location.reload();
        } catch (error) {
            setError(error.response.data.error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='auth-container'>
            <div className='auth-box'>
                <h2>Login to Your Account</h2>
                {error && <p className='error-message'>{error}</p>}
                <form onSubmit={handleSubmit} className='auth-form'>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} />
                    </div>
                    <button type='submit' className='auth-button' disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className='auth-footer'>Don't have an account? <Link to='/register'>Register</Link></p>
            </div>
        </div>
    );
}

export default Login;