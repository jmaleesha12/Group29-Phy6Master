import React, { useState } from 'react';

interface BankSlipUploadFormProps {
    onSubmit: (amount: number, file: File) => void;
    isLoading: boolean;
    amount: number;
}

const BankSlipUploadForm: React.FC<BankSlipUploadFormProps> = ({ onSubmit, isLoading, amount }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            onSubmit(amount, file);
        }
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
                    Upload Bank Slip (JPG, PNG, PDF max 5MB)
                </label>
                <input
                    type="file"
                    required
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !file}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {isLoading ? 'Uploading...' : 'Upload & Submit'}
            </button>
        </form>
    );
};

export default BankSlipUploadForm;
