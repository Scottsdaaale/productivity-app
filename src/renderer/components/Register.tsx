import React, { useState } from 'react';
import { register } from './api/auth';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleRegister = async () => {
        try {
            await register(username, email, password);
            navigate('/login'); // Redirect to login page using navigate
        } catch (error) {
            setError('Failed to register');
            console.error('Register error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full max-w-sm p-8 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button
                    onClick={handleRegister}
                    className="w-full p-2 bg-blue-500 text-white rounded"
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Register;
