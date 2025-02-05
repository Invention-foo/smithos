import React, { useEffect, useRef } from 'react';

// for UX - clicking outside the menu should close it

interface MenuWrapperProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  anchor?: 'top' | 'bottom';
  triggerRef: React.RefObject<HTMLElement>;
}

export function MenuWrapper({ 
  onClose, 
  children, 
  className = '',
  anchor = 'bottom',
  triggerRef
}: MenuWrapperProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      // Don't close if clicking the trigger button
      if (triggerRef.current?.contains(target)) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose, triggerRef]);

  useEffect(() => {
    if (menuRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuEl = menuRef.current;
      
      if (anchor === 'bottom') {
        menuEl.style.bottom = `${window.innerHeight - triggerRect.top}px`;
      } else {
        menuEl.style.top = `${triggerRect.bottom}px`;
      }
      menuEl.style.left = `${triggerRect.left}px`;
    }
  }, [anchor]);

  return (
    <div 
      ref={menuRef}
      className={`fixed bg-green-900 border border-green-500 z-50 ${className}`}
    >
      {children}
    </div>
  );
} 