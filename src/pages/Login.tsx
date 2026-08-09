import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import api from '../services/api';
import { setUserToken } from '../hooks/useAuth';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/user/login', formData);
            const token = res.data.data.token;
            setUserToken(token);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-4 py-16">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#C89B3C]/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#DCCFC0]/30 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center mb-10">
                    <span className="font-serif text-3xl font-bold text-[#1F2937] tracking-tight">
                        Hooks <span className="text-[#C89B3C]">&</span> Knots
                    </span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 rounded-3xl border border-[#DCCFC0]/30 shadow-xl"
                >
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-3xl font-bold text-[#1F2937] mb-2">Welcome Back</h1>
                        <p className="text-[#5A5A5A] font-sans text-sm">Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-sans">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs uppercase tracking-widest mb-2 text-[#5A5A5A] font-sans font-medium">Email Address</label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 border border-[#DCCFC0]/50 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/40 focus:border-[#C89B3C] transition-all font-sans text-[#1F2937]"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest mb-2 text-[#5A5A5A] font-sans font-medium">Password</label>
                            <input
                                required
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 border border-[#DCCFC0]/50 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/40 focus:border-[#C89B3C] transition-all font-sans text-[#1F2937]"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#1F2937] text-white font-semibold rounded-xl hover:bg-[#C89B3C] transition-all duration-300 flex justify-center items-center gap-2 font-sans mt-2 disabled:opacity-70"
                        >
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing In...</> : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#F8F6F2] text-center text-[#5A5A5A] text-sm font-sans">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#C89B3C] font-semibold hover:underline">
                            Create one now
                        </Link>
                    </div>
                </motion.div>

                <p className="text-center text-xs text-[#9ca3af] mt-6 font-sans">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
