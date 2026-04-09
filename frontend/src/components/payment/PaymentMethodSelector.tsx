import React from 'react';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selectedMethod, onSelectMethod }) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => onSelectMethod('ATM_TRANSFER')}
        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
          selectedMethod === 'ATM_TRANSFER'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        ATM Transfer
      </button>
      <button
        onClick={() => onSelectMethod('BANK_SLIP')}
        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
          selectedMethod === 'BANK_SLIP'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Bank Slip Upload
      </button>
      <button
        onClick={() => onSelectMethod('ONLINE')}
        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
          selectedMethod === 'ONLINE'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Online Payment
      </button>
    </div>
  );
};

export default PaymentMethodSelector;
