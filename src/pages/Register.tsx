import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { setUserToken } from '../hooks/useAuth';

export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Step 1 data
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
    });

    // Step 2 data
    const [otp, setOtp] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    // Timer for resend cooldown
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const res = await api.post('/auth/user/register', formData);
            setSuccessMessage(res.data?.message || 'OTP sent to your email.');
            setStep(2);
            setResendCooldown(60);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const res = await api.post('/auth/user/verify-otp', {
                email: formData.email,
                otp
            });
            const token = res.data.data.token;
            setUserToken(token);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const res = await api.post('/auth/user/resend-otp', { email: formData.email });
            setSuccessMessage(res.data?.message || 'A new OTP has been sent to your email.');
            setResendCooldown(60);
            setOtp('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-4 py-16">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#C89B3C]/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#DCCFC0]/30 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-lg relative">
                <Link to="/" className="flex items-center justify-center mb-10">
                    <span className="font-serif text-3xl font-bold text-[#1F2937] tracking-tight">
                        Hooks <span className="text-[#C89B3C]">&</span> Knots
                    </span>
                </Link>

                <div className="bg-white p-10 rounded-3xl border border-[#DCCFC0]/30 shadow-xl overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-8">
                                    <h1 className="font-serif text-3xl font-bold text-[#1F2937] mb-2">Create Account</h1>
                                    <p className="text-[#5A5A5A] font-sans text-sm">Join Hooks & Knots for a better shopping experience</p>
                                </div>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-sans">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleRegister} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest mb-2 text-[#5A5A5A] font-sans font-medium">First Name</label>
                                            <input
                                                required
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 border border-[#DCCFC0]/50 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/40 focus:border-[#C89B3C] transition-all font-sans text-[#1F2937]"
                                                placeholder="First"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest mb-2 text-[#5A5A5A] font-sans font-medium">Last Name</label>
                                            <input
                                                required
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 border border-[#DCCFC0]/50 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/40 focus:border-[#C89B3C] transition-all font-sans text-[#1F2937]"
                                                placeholder="Last"
                                            />
                                        </div>
                                    </div>
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
                                        <label className="block text-xs uppercase tracking-widest mb-2 text-[#5A5A5A] font-sans font-medium">Phone Number <span className="normal-case text-[#9ca3af]">(optional)</span></label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 border border-[#DCCFC0]/50 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/40 focus:border-[#C89B3C] transition-all font-sans text-[#1F2937]"
                                            placeholder="+91 9876543210"
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
                                            placeholder="Min. 8 characters"
                                            minLength={6}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-[#1F2937] text-white font-semibold rounded-xl hover:bg-[#C89B3C] transition-all duration-300 flex justify-center items-center gap-2 font-sans mt-2 disabled:opacity-70"
                                    >
                                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...</> : 'Continue'}
                                    </button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-[#F8F6F2] text-center text-[#5A5A5A] text-sm font-sans">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-[#C89B3C] font-semibold hover:underline">
                                        Sign In
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <button 
                                    onClick={() => {
                                        setStep(1);
                                        setError('');
                                        setSuccessMessage('');
                                    }}
                                    className="absolute top-8 left-8 text-[#5A5A5A] hover:text-[#C89B3C] transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                
                                <div className="text-center mb-8 mt-4">
                                    <h1 className="font-serif text-3xl font-bold text-[#1F2937] mb-2">Verify Email</h1>
                                    <p className="text-[#5A5A5A] font-sans text-sm">
                                        We sent a 6-digit code to <br />
                                        <span className="font-semibold text-[#1F2937]">{formData.email}</span>
                                    </p>
                                </div>

                                {successMessage && (
                                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-sans text-center">
                                        {successMessage}
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-sans text-center">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <div>
                                        <input
                                            required
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className="w-full text-center tracking-[1em] text-3xl px-4 py-4 border border-[#DCCFC0]/50 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/40 focus:border-[#C89B3C] transition-all font-sans text-[#1F2937] font-bold"
                                            placeholder="------"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || otp.length !== 6}
                                        className="w-full py-4 bg-[#1F2937] text-white font-semibold rounded-xl hover:bg-[#C89B3C] transition-all duration-300 flex justify-center items-center gap-2 font-sans disabled:opacity-70 disabled:hover:bg-[#1F2937]"
                                    >
                                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : 'Verify & Create Account'}
                                    </button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-[#F8F6F2] text-center text-[#5A5A5A] text-sm font-sans">
                                    Didn't receive the code?{' '}
                                    <button 
                                        onClick={handleResendOtp}
                                        disabled={resendCooldown > 0 || loading}
                                        className={`font-semibold ${resendCooldown > 0 ? 'text-[#9ca3af] cursor-not-allowed' : 'text-[#C89B3C] hover:underline'}`}
                                    >
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-center text-xs text-[#9ca3af] mt-6 font-sans">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
