import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { ModalWrapper } from '@/components/modal-wrapper';

interface NeoGuardProps {
  onClose: () => void;
}

export function NeoGuard({ onClose }: NeoGuardProps) {
  // const handleRedirect = () => {
  //   // This would typically open in a new tab, but for this example, we'll just log it
  //   console.log("Redirecting to external NeoGuard interface");
  //   // In a real application, you might use:
  //   // window.open("https://neoguard-external-interface.com", "_blank");
  // };

  return (
    <ModalWrapper onClose={onClose} className="p-6 rounded-lg w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-green-500">NeoGuard</h2>
        <button onClick={onClose} className="text-green-500 hover:text-green-400">
          <X size={24} />
        </button>
      </div>
      <div className="text-green-300 mb-6">
        <p className="mb-4">This program is for Telegram Community Owners only.</p>
        <p>Configure security settings for your Telegram community in the external NeoGuard interface.</p>
      </div>
      <button
        onClick={onClose}
        className="w-full bg-green-700 text-green-100 px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center justify-center"
      >
        <span>Coming Soon</span>
        <ExternalLink size={18} className="ml-2" />
      </button>
    </ModalWrapper>
  );
}

