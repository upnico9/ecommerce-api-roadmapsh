import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid';
function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (!userData || !localStorage.getItem('token')) {
            navigate('/login');
        } else {
            setUser(userData.email);
            setLoading(false);
        }
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='profile-container'>
            <div className='profile-card'>
                <div className='profile-header'>
                    <div className='profile-avatar'>
                        <UserCircleIcon className='user-icon' />
                    </div>
                    <h2 className='profile-name'>{user.email}</h2>
                </div>
                <div className='profile-info'>
                    <div className='info-group'>
                        <label>Email</label>
                        <p>{user.email}</p>
                    </div>

                    <div className='info-group'>
                        <label> Member Since</label>
                        <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
