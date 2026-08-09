import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export default function Cart() {
    const { items, total, removeItem, updateQuantity } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-[#F8F6F2] flex flex-col items-center">
                <ShoppingBag className="w-16 h-16 text-[#DCCFC0] mb-4" />
                <h1 className="font-serif text-3xl text-[#1F2937] mb-6">Your Cart is Empty</h1>
                <p className="text-[#5A5A5A] mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Discover our beautiful handcrafted collections.</p>
                <Link to="/shop" className="px-8 py-3 bg-[#1F2937] text-white font-medium rounded-xl hover:bg-[#C89B3C] transition-colors font-sans">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-[#F8F6F2]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/shop" className="inline-flex items-center gap-2 text-[#5A5A5A] hover:text-[#C89B3C] mb-8 font-sans transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="font-serif text-4xl font-bold text-[#1F2937] mb-8">Shopping Cart</h1>
                        
                        <div className="bg-white rounded-3xl border border-[#DCCFC0]/30 shadow-sm overflow-hidden">
                            {items.map((item, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={item.product_id} 
                                    className="p-6 flex gap-6 items-center border-b border-[#F8F6F2] last:border-b-0"
                                >
                                    <Link to={`/shop`} className="w-24 h-24 bg-[#F8F6F2] rounded-xl overflow-hidden shrink-0 block">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </Link>
                                    
                                    <div className="flex-1 flex flex-col justify-center">
                                        <Link to={`/shop`} className="font-serif text-lg font-bold text-[#1F2937] hover:text-[#C89B3C] transition-colors">
                                            {item.name}
                                        </Link>
                                        <div className="text-sm text-[#5A5A5A] mt-1 font-sans">Unit Price: ₹{item.price}</div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-[#DCCFC0]/50 rounded-lg overflow-hidden bg-[#F8F6F2]">
                                            <button 
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                className="p-2 hover:bg-white hover:text-[#C89B3C] transition-colors text-[#5A5A5A]"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium text-[#1F2937] font-sans">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                className="p-2 hover:bg-white hover:text-[#C89B3C] transition-colors text-[#5A5A5A]"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="font-sans font-bold text-lg text-[#1F2937] w-24 text-right">
                                        ₹{item.price * item.quantity}
                                    </div>

                                    <button 
                                        onClick={() => removeItem(item.product_id)}
                                        className="p-2 text-[#5A5A5A] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="bg-white p-8 rounded-3xl border border-[#DCCFC0]/30 shadow-xl self-start sticky top-32"
                    >
                        <h3 className="font-serif text-2xl text-[#1F2937] mb-6">Order Summary</h3>
                        
                        <div className="space-y-4 font-sans">
                            <div className="flex justify-between text-[#5A5A5A]">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-[#5A5A5A]">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-[#1F2937] pt-6 border-t border-[#F8F6F2] mt-4">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/checkout')}
                            className="w-full mt-8 py-4 bg-[#1F2937] text-white font-bold rounded-xl hover:bg-[#C89B3C] transition-colors flex justify-center items-center gap-2 font-sans"
                        >
                            Proceed to Checkout
                        </button>
                        
                        <p className="text-center text-xs text-[#5A5A5A] mt-4 font-sans">
                            Taxes included. Shipping calculated at checkout.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
