import React from 'react';

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
}

export function PaginationButton({
  children,
  className = '',
  active = false,
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      className={`px-3 py-1 rounded border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 ${active ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
