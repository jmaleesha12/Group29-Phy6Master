import React, { useState } from 'react';

interface ATMTransferFormProps {
    onSubmit: (amount: number, referenceNumber: string) => void;
    isLoading: boolean;
    amount: number;
}

const ATMTransferForm: React.FC<ATMTransferFormProps> = ({ onSubmit, isLoading, amount }) => {
    const [referenceNumber, setReferenceNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(amount, referenceNumber);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (LKR)
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-semibold">
                    {amount.toFixed(2)}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                </label>
                <input
                    type="text"
                    required
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter the ATM transaction reference"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {isLoading ? 'Submitting...' : 'Submit Payment Request'}
            </button>
        </form>
    );
};

export default ATMTransferForm;
