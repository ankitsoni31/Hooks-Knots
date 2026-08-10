import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ShoppingBag, Loader2, ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checkout() {
    const { items, clearCart, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{code: string; discount_amount: number} | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponMessage, setCouponMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    // If subtotal changes, remove the coupon to prevent incorrect discount amounts
    const [prevSubtotal, setPrevSubtotal] = useState(subtotal);
    useEffect(() => {
        if (subtotal !== prevSubtotal) {
            setPrevSubtotal(subtotal);
            if (appliedCoupon) {
                setAppliedCoupon(null);
                setCouponCode('');
                setCouponMessage({ type: 'error', text: 'Cart updated. Please re-apply your coupon.' });
            }
        }
    }, [subtotal, prevSubtotal, appliedCoupon]);
    
    const discount = appliedCoupon ? appliedCoupon.discount_amount : 0;
    const total = subtotal - discount; // Shipping is 0
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);
    
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', phone: '',
        address_line: '', city: '', state: '', pincode: '', country: 'India'
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return setError('Cart is empty');
        setLoading(true);
        setError('');

        try {
            // 1. Create order in backend
            const payload = {
                customer: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone: formData.phone
                },
                address: {
                    full_name: `${formData.first_name} ${formData.last_name}`,
                    phone: formData.phone,
                    address_line: formData.address_line,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country
                },
                items: items.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
                coupon_code: appliedCoupon ? appliedCoupon.code : undefined
            };

            const res = await api.post('/orders', payload);
            const { razorpayOrderId, razorpayKeyId, amount, currency, orderNumber, devMode } = res.data.data;

            if (devMode) {
                clearCart();
                navigate('/order-confirmation', { state: { orderNumber, status: 'PENDING (Dev Mode)' } });
                return;
            }

            // 2. Open Razorpay Checkout
            const options = {
                key: razorpayKeyId,
                amount: amount,
                currency: currency,
                name: 'Hooks & Knots',
                description: `Order ${orderNumber}`,
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        await api.post('/payments/razorpay/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        clearCart();
                        navigate('/order-confirmation', { state: { orderNumber, status: 'SUCCESS' } });
                    } catch (err: any) {
                        setError('Payment verification failed. Please contact support.');
                        setLoading(false);
                    }
                },
                prefill: {
                    name: `${formData.first_name} ${formData.last_name}`,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: '#C89B3C' }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function () {
                setError('Payment failed. You can try again.');
                setLoading(false);
            });
            rzp.open();

        } catch (err: any) {
            setError(err.response?.data?.message || 'Checkout failed');
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-[#F8F6F2] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#C89B3C]" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-[#F8F6F2] flex flex-col items-center">
                <ShoppingBag className="w-16 h-16 text-[#DCCFC0] mb-4" />
                <h1 className="font-serif text-3xl text-[#1F2937] mb-6">Your Cart is Empty</h1>
                <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-[#1F2937] text-white rounded-xl hover:bg-[#C89B3C] transition-colors">Continue Shopping</button>
            </div>
        );
    }
    
    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode) return;
        setCouponLoading(true);
        setCouponMessage(null);
        try {
            const res = await api.post('/coupons/validate', { code: couponCode, subtotal });
            setAppliedCoupon(res.data.data);
            setCouponMessage({ type: 'success', text: `Coupon applied successfully!` });
        } catch (err: any) {
            setAppliedCoupon(null);
            setCouponMessage({ type: 'error', text: err.response?.data?.message || 'Invalid coupon' });
        } finally {
            setCouponLoading(false);
        }
    };
    
    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponMessage(null);
    };

    return (
        <div className="pt-24 pb-20 min-h-screen bg-[#F8F6F2]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#5A5A5A] hover:text-[#C89B3C] mb-8 font-sans">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Checkout Form */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <h1 className="font-serif text-4xl font-bold text-[#1F2937]">Checkout</h1>
                        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">{error}</div>}
                        
                        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-[#DCCFC0]/30 shadow-sm space-y-4">
                                <h3 className="font-serif text-xl text-[#1F2937] border-b border-[#F8F6F2] pb-4">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A]">First Name</label><input required name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-4 py-2 border border-[#DCCFC0]/30 rounded-xl bg-[#F8F6F2]" /></div>
                                    <div><label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A]">Last Name</label><input required name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-4 py-2 border border-[#DCCFC0]/30 rounded-xl bg-[#F8F6F2]" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A]">Email</label><input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-[#DCCFC0]/30 rounded-xl bg-[#F8F6F2]" /></div>
                                    <div><label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A]">Phone</label><input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-[#DCCFC0]/30 rounded-xl bg-[#F8F6F2]" /></div>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl border border-[#DCCFC0]/30 shadow-sm space-y-4">
                                <h3 className="font-serif text-xl text-[#1F2937] border-b border-[#F8F6F2] pb-4">Shipping Address</h3>
                                <div><label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A]">Address</label><input required name="address_line" value={formData.address_line} onChange={handleChange} className="w-full px-4 py-2 border border-[#DCCFC0]/30 rounded-xl bg-[#F8F6F2]" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A]">City</label><input required name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-[#DCCFC0]/30 rounded-xl bg-[#F8F6F2]" /></div>
                                    <div><label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A]">State</label><input required name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border border-[#DCCFC0]/30 rounded-xl bg-[#F8F6F2]" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A]">PIN Code</label><input required name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-2 border border-[#DCCFC0]/30 rounded-xl bg-[#F8F6F2]" /></div>
                                    <div><label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A]">Country</label><input readOnly value="India" className="w-full px-4 py-2 border border-[#DCCFC0]/30 rounded-xl bg-[#F8F6F2] text-[#9ca3af] cursor-not-allowed" /></div>
                                </div>
                            </div>
                        </form>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl border border-[#DCCFC0]/30 shadow-xl self-start sticky top-32">
                        <h3 className="font-serif text-2xl text-[#1F2937] mb-6">Order Summary</h3>
                        <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                            {items.map(item => (
                                <div key={item.product_id} className="flex gap-4 group">
                                    <div className="w-20 h-20 bg-[#F8F6F2] rounded-xl overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-serif font-bold text-[#1F2937] line-clamp-1">{item.name}</h4>
                                            <button 
                                                type="button"
                                                onClick={() => removeItem(item.product_id)} 
                                                className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-2 border border-[#DCCFC0]/30 rounded-lg p-1 bg-[#F8F6F2]">
                                                <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1 hover:bg-white rounded-md text-[#5A5A5A] hover:text-[#1F2937] transition-colors"><Minus className="w-3 h-3" /></button>
                                                <span className="text-sm font-bold w-6 text-center font-sans">{item.quantity}</span>
                                                <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1 hover:bg-white rounded-md text-[#5A5A5A] hover:text-[#1F2937] transition-colors"><Plus className="w-3 h-3" /></button>
                                            </div>
                                            <div className="text-sm text-[#5A5A5A] font-sans">× ₹{item.price.toLocaleString("en-IN")}</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-[#1F2937] flex items-center shrink-0 font-sans">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Coupon Section */}
                        <div className="border-t border-[#F8F6F2] pt-6 mb-6">
                            <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Gift card or discount code" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    disabled={!!appliedCoupon || couponLoading}
                                    className="flex-1 px-4 py-2 border border-[#DCCFC0]/30 rounded-xl bg-[#F8F6F2] font-sans disabled:opacity-50" 
                                />
                                {appliedCoupon ? (
                                    <button type="button" onClick={removeCoupon} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold font-sans hover:bg-red-100 transition-colors border border-red-100">
                                        Remove
                                    </button>
                                ) : (
                                    <button type="submit" disabled={!couponCode || couponLoading} className="px-6 py-2 bg-[#1F2937] text-white rounded-xl font-bold font-sans hover:bg-[#C89B3C] transition-colors disabled:opacity-50">
                                        {couponLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Apply'}
                                    </button>
                                )}
                            </form>
                            {couponMessage && (
                                <p className={`text-sm mt-2 font-sans ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {couponMessage.text}
                                </p>
                            )}
                        </div>

                        <div className="border-t border-[#F8F6F2] pt-6 space-y-3 font-sans">
                            <div className="flex justify-between text-[#5A5A5A]"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-[#C89B3C] font-semibold">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span>-₹{appliedCoupon.discount_amount.toLocaleString("en-IN")}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[#5A5A5A]"><span>Shipping</span><span>Free</span></div>
                            <div className="flex justify-between font-bold text-xl text-[#1F2937] pt-4 border-t border-[#F8F6F2]"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
                        </div>
                        <button form="checkout-form" type="submit" disabled={loading} className="w-full mt-8 py-4 bg-[#1F2937] text-white font-bold rounded-xl hover:bg-[#C89B3C] transition-colors flex justify-center items-center gap-2">
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : 'Pay Now securely with Razorpay'}
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
