import React, { useEffect, useRef } from 'react';

// for UX - clicking outside the modal should close it

interface ModalWrapperProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function ModalWrapper({ onClose, children, className = '' }: ModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef} 
        className={`bg-green-900 border border-green-500 ${className}`}
      >
        {children}
      </div>
    </div>
  );
} 