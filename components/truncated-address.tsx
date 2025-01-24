import React from 'react';
import { Copy } from 'lucide-react';

interface TruncatedAddressProps {
  address: string;
}

export function TruncatedAddress({ address }: TruncatedAddressProps) {
  const truncatedAddress = `${address.slice(0, 6)}....${address.slice(-4)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address).then(() => {
      // You could add a toast notification here
      console.log('Address copied to clipboard');
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-green-300 text-sm">{truncatedAddress}</span>
      <button
        onClick={copyToClipboard}
        className="text-green-500 hover:text-green-400 transition-colors"
        title="Copy full address"
      >
        <Copy size={16} />
      </button>
    </div>
  );
}

