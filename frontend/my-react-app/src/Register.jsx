import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...formData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        for (const key in formData) {
            if (formData[key].trim() === '') {
                setError(`${key} is required`);
                return;
            }
        }


        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3000/api/users/register', formData);
            console.log(response);
            console.log("Registration successful");
            navigate('/login');
        } catch (error) {
            setError(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='auth-container'>
            <div className="auth-box">
                <h2>Create an account</h2>
                {error && <p className='error-message'>{error}</p>}
                <form onSubmit={handleSubmit} className='auth-form'>
                    <div className='form-group'>
                        <label htmlFor='firstName'>First Name</label>
                        <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='lastName'>Last Name</label>
                        <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} />
                    </div>
                    <button type='submit' className='auth-button' disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className='auth-footer'>Already have an account? <Link to='/login'>Login</Link></p>
            </div>

        </div>
    );
}

export default Register;