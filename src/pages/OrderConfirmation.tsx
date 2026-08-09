import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function OrderConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { orderNumber: string; status: string } | null;

    if (!state) return <Navigate to="/" replace />;

    const isSuccess = state.status.includes('SUCCESS') || state.status.includes('Dev Mode');

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#F8F6F2] flex flex-col items-center">
            <div className="bg-white p-10 rounded-3xl border border-[#DCCFC0]/30 shadow-xl max-w-lg w-full text-center">
                {isSuccess ? (
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                ) : (
                    <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                )}
                
                <h1 className="font-serif text-3xl font-bold text-[#1F2937] mb-2">
                    {isSuccess ? 'Payment Successful!' : 'Payment Pending'}
                </h1>
                
                <p className="text-[#5A5A5A] mb-8 font-sans">
                    {isSuccess 
                        ? 'Thank you for your purchase. We are processing your order.' 
                        : 'There was an issue processing your payment. Your order is pending.'}
                </p>

                <div className="bg-[#F8F6F2] p-4 rounded-xl mb-8">
                    <div className="text-sm text-[#5A5A5A] uppercase tracking-wider mb-1">Order Number</div>
                    <div className="font-mono text-lg font-bold text-[#1F2937]">{state.orderNumber}</div>
                </div>

                <button 
                    onClick={() => navigate('/shop')} 
                    className="w-full py-4 bg-[#1F2937] text-white font-bold rounded-xl hover:bg-[#C89B3C] transition-colors"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}
