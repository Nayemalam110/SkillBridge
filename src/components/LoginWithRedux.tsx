import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';

export const LoginWithRedux = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await dispatch(login({ email, password }) as any);
            if (result?.meta?.requestStatus === 'fulfilled') {
                // Navigate to dashboard on successful login
                navigate('/dashboard');
            }
        } catch (err) {
            // error is handled by slice state
        }
    };

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Login</h2>

            {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>}

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};
