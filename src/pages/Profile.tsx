import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, User as UserIcon, Package, LogOut } from 'lucide-react';
import { useAuth, clearUserToken } from '../hooks/useAuth';
import api from '../services/api';

type Tab = 'settings' | 'orders';

export default function Profile() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('orders');
    
    // Profile State
    const [formData, setFormData] = useState({ first_name: '', last_name: '', phone: '' });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

    // Password State
    const [pwdData, setPwdData] = useState({ current_password: '', new_password: '' });
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

    // Orders State
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        } else if (user) {
            setFormData({ first_name: user.first_name, last_name: user.last_name, phone: user.phone || '' });
            fetchOrders();
        }
    }, [isLoading, isAuthenticated, user, navigate]);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/user/orders');
            setOrders(res.data.data.orders);
        } catch (err) {
            console.error('Failed to fetch orders');
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMsg({ type: '', text: '' });
        try {
            await api.put('/user/profile', formData);
            setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
            setTimeout(() => window.location.reload(), 1000); // Reload to fetch new state
        } catch (err: any) {
            setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdLoading(true);
        setPwdMsg({ type: '', text: '' });
        try {
            await api.put('/user/password', pwdData);
            setPwdMsg({ type: 'success', text: 'Password updated successfully.' });
            setPwdData({ current_password: '', new_password: '' });
        } catch (err: any) {
            setPwdMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setPwdLoading(false);
        }
    };

    const handleLogout = () => {
        clearUserToken();
        window.location.href = '/';
    };

    if (isLoading || !user) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-[#F8F6F2] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#C89B3C]" />
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-[#F8F6F2]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 shrink-0">
                        <div className="bg-white rounded-3xl border border-[#DCCFC0]/30 shadow-sm overflow-hidden p-6">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-[#F8F6F2] rounded-full mx-auto flex items-center justify-center text-[#1F2937] mb-3">
                                    <span className="font-serif text-2xl font-bold">{user.first_name[0]}{user.last_name[0]}</span>
                                </div>
                                <h2 className="font-serif text-xl font-bold text-[#1F2937]">{user.first_name} {user.last_name}</h2>
                                <p className="text-sm text-[#5A5A5A] font-sans">{user.email}</p>
                            </div>

                            <nav className="space-y-2 font-sans">
                                <button 
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-[#F8F6F2] text-[#C89B3C] font-semibold' : 'text-[#5A5A5A] hover:bg-[#F8F6F2]/50 hover:text-[#1F2937]'}`}
                                >
                                    <Package className="w-5 h-5" /> My Orders
                                </button>
                                <button 
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-[#F8F6F2] text-[#C89B3C] font-semibold' : 'text-[#5A5A5A] hover:bg-[#F8F6F2]/50 hover:text-[#1F2937]'}`}
                                >
                                    <UserIcon className="w-5 h-5" /> Profile Settings
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-4"
                                >
                                    <LogOut className="w-5 h-5" /> Sign Out
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {activeTab === 'orders' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h1 className="font-serif text-3xl font-bold text-[#1F2937] mb-6">My Orders</h1>
                                
                                {ordersLoading ? (
                                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#C89B3C]" /></div>
                                ) : orders.length === 0 ? (
                                    <div className="bg-white p-12 rounded-3xl border border-[#DCCFC0]/30 text-center">
                                        <Package className="w-12 h-12 text-[#DCCFC0] mx-auto mb-4" />
                                        <h3 className="font-serif text-xl font-bold text-[#1F2937] mb-2">No orders yet</h3>
                                        <p className="text-[#5A5A5A] font-sans">You haven't placed any orders yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-white rounded-3xl border border-[#DCCFC0]/30 overflow-hidden shadow-sm">
                                                <div className="bg-[#F8F6F2] px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-[#DCCFC0]/30 font-sans">
                                                    <div>
                                                        <div className="text-xs uppercase tracking-wider text-[#5A5A5A] mb-1">Order Number</div>
                                                        <div className="font-bold text-[#1F2937]">{order.order_number}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs uppercase tracking-wider text-[#5A5A5A] mb-1">Date Placed</div>
                                                        <div className="font-bold text-[#1F2937]">{new Date(order.placed_at).toLocaleDateString('en-IN')}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs uppercase tracking-wider text-[#5A5A5A] mb-1">Total Amount</div>
                                                        <div className="font-bold text-[#1F2937]">₹{order.total}</div>
                                                    </div>
                                                    <div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="space-y-4">
                                                        {order.items?.map((item: any) => (
                                                            <div key={item.id} className="flex justify-between items-center py-3 border-b border-[#F8F6F2] last:border-0 font-sans">
                                                                <div className="flex-1">
                                                                    <div className="font-semibold text-[#1F2937]">{item.product_name}</div>
                                                                    <div className="text-sm text-[#5A5A5A]">Qty: {item.quantity} × ₹{item.unit_price}</div>
                                                                </div>
                                                                <div className="font-bold text-[#1F2937]">
                                                                    ₹{item.total_price}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                <h1 className="font-serif text-3xl font-bold text-[#1F2937] mb-6">Profile Settings</h1>

                                {/* Profile Update Form */}
                                <div className="bg-white p-8 rounded-3xl border border-[#DCCFC0]/30 shadow-sm">
                                    <h3 className="font-serif text-xl font-bold text-[#1F2937] mb-6">Personal Information</h3>
                                    
                                    {profileMsg.text && (
                                        <div className={`mb-6 p-4 rounded-xl border text-sm font-sans ${profileMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                            {profileMsg.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A] font-medium font-sans">First Name</label>
                                                <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full px-4 py-3 border border-[#DCCFC0]/40 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/50 transition-all font-sans" />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A] font-medium font-sans">Last Name</label>
                                                <input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full px-4 py-3 border border-[#DCCFC0]/40 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/50 transition-all font-sans" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A] font-medium font-sans">Email Address</label>
                                            <input readOnly value={user.email} className="w-full px-4 py-3 border border-[#DCCFC0]/40 rounded-xl bg-[#F8F6F2] text-[#9ca3af] cursor-not-allowed font-sans" />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A] font-medium font-sans">Phone</label>
                                            <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border border-[#DCCFC0]/40 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/50 transition-all font-sans" />
                                        </div>
                                        <button type="submit" disabled={profileLoading} className="px-6 py-3 bg-[#1F2937] text-white font-medium rounded-xl hover:bg-[#C89B3C] transition-all duration-300 flex items-center gap-2 font-sans">
                                            {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />} Update Profile
                                        </button>
                                    </form>
                                </div>

                                {/* Password Update Form */}
                                <div className="bg-white p-8 rounded-3xl border border-[#DCCFC0]/30 shadow-sm">
                                    <h3 className="font-serif text-xl font-bold text-[#1F2937] mb-6">Change Password</h3>
                                    
                                    {pwdMsg.text && (
                                        <div className={`mb-6 p-4 rounded-xl border text-sm font-sans ${pwdMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                            {pwdMsg.text}
                                        </div>
                                    )}

                                    <form onSubmit={handlePasswordUpdate} className="space-y-5">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A] font-medium font-sans">Current Password</label>
                                            <input required type="password" value={pwdData.current_password} onChange={e => setPwdData({...pwdData, current_password: e.target.value})} className="w-full px-4 py-3 border border-[#DCCFC0]/40 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/50 transition-all font-sans" />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider mb-2 text-[#5A5A5A] font-medium font-sans">New Password</label>
                                            <input required type="password" value={pwdData.new_password} onChange={e => setPwdData({...pwdData, new_password: e.target.value})} className="w-full px-4 py-3 border border-[#DCCFC0]/40 rounded-xl bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/50 transition-all font-sans" />
                                        </div>
                                        <button type="submit" disabled={pwdLoading} className="px-6 py-3 bg-[#1F2937] text-white font-medium rounded-xl hover:bg-[#C89B3C] transition-all duration-300 flex items-center gap-2 font-sans">
                                            {pwdLoading && <Loader2 className="w-4 h-4 animate-spin" />} Change Password
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
