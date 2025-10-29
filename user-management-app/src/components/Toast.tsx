
import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const isSuccess = type === 'success';

  const baseClasses = 'fixed top-5 right-5 z-50 flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow-lg dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800 transition-transform duration-300';
  const animationClasses = 'transform translate-x-0 opacity-100';

  const iconClasses = `w-10 h-10 flex items-center justify-center rounded-lg ${isSuccess ? 'bg-green-100 dark:bg-green-800 text-green-500 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-500 dark:text-red-200'}`;
  const icon = isSuccess ? <CheckCircleIcon className="w-6 h-6" /> : <XCircleIcon className="w-6 h-6" />;
  
  return (
    <div className={`${baseClasses} ${animationClasses}`} role="alert">
      <div className={iconClasses}>
        {icon}
      </div>
      <div className="pl-4 text-sm font-normal">{message}</div>
    </div>
  );
};

export default Toast;
