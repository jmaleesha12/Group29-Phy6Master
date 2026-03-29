import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentMethodSelector from '../../components/payment/PaymentMethodSelector';
import ATMTransferForm from '../../components/payment/ATMTransferForm';
import BankSlipUploadForm from '../../components/payment/BankSlipUploadForm';
import { useToast } from '../../components/ui/use-toast';
import { ArrowLeft, CreditCard } from 'lucide-react';

// Hardcoded amount for the class for demonstration since we don't have the class fetch logic here
const CLASS_FEE = 2500.00;

const PaymentPage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [selectedMethod, setSelectedMethod] = useState<string>('ATM_TRANSFER');
    const [isLoading, setIsLoading] = useState(false);

    // Retrieve the active User ID from localStorage (set during login)
    const studentId = Number(localStorage.getItem("authUserId")) || 1;

    const handleAtmSubmit = async (amount: number, referenceNumber: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/student/payments/atm-transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    classId: Number(classId),
                    studentId,
                    amount,
                    referenceNumber
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast({ title: 'Success', description: data.message });
                navigate('/student/dashboard');
            } else {
                toast({ title: 'Error', description: data.message, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to submit payment', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBankSlipSubmit = async (amount: number, file: File) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('classId', String(classId));
            formData.append('studentId', String(studentId));
            formData.append('amount', String(amount));
            formData.append('file', file);

            const response = await fetch('/api/student/payments/bank-slip', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                toast({ title: 'Success', description: data.message });
                navigate('/student/dashboard');
            } else {
                toast({ title: 'Error', description: data.message, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to upload bank slip', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnlinePayment = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/student/payments/online/checkout?classId=${classId}&studentId=${studentId}&amount=${CLASS_FEE}`, {
                method: 'POST',
            });
            const data = await response.json();
            toast({ title: 'Online Payment', description: data.message });
        } catch (error) {
            toast({ title: 'Error', description: 'Unable to connect to online payment service', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">Make a Payment</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Class Enrollment Fee</h2>
                    <p className="text-gray-500 mb-8">Select your preferred payment method to complete the class enrollment request.</p>

                    <PaymentMethodSelector selectedMethod={selectedMethod} onSelectMethod={setSelectedMethod} />

                    <div className="mt-8">
                        {selectedMethod === 'ATM_TRANSFER' && (
                            <ATMTransferForm onSubmit={handleAtmSubmit} isLoading={isLoading} amount={CLASS_FEE} />
                        )}

                        {selectedMethod === 'BANK_SLIP' && (
                            <BankSlipUploadForm onSubmit={handleBankSlipSubmit} isLoading={isLoading} amount={CLASS_FEE} />
                        )}

                        {selectedMethod === 'ONLINE' && (
                            <div className="text-center py-12 px-4 shadow-sm rounded-lg border border-gray-100 bg-gray-50">
                                <CreditCard className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Pay with Card Online</h3>
                                <p className="text-gray-500 mb-6">Securely pay using your credit or debit card through our online gateway.</p>
                                <button
                                    onClick={handleOnlinePayment}
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg outline-none transition-colors"
                                >
                                    {isLoading ? 'Processing...' : `Pay LKR ${CLASS_FEE.toFixed(2)}`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentPage;
