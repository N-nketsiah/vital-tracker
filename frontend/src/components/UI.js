import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition duration-200';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400',
    success: 'bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, type = 'text', name, value, onChange, placeholder = '', required = false }) => (
  <div className='mb-4'>
    {label && <label className='block text-sm font-semibold text-gray-700 mb-2'>{label}</label>}
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
    />
  </div>
);

export const Select = ({ label, name, options, value, onChange, required = false }) => (
  <div className='mb-4'>
    {label && <label className='block text-sm font-semibold text-gray-700 mb-2'>{label}</label>}
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
    >
      <option value=''>Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const Alert = ({ type = 'info', message, onClose }) => {
  const bgColors = {
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700'
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${bgColors[type]}`} role='alert'>
      <div className='flex justify-between items-center'>
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className='font-bold'>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export const StatCard = ({ title, value, unit = '', trend = null }) => (
  <Card className='text-center'>
    <p className='text-gray-600 text-sm font-semibold mb-2'>{title}</p>
    <p className='text-3xl font-bold text-blue-600'>
      {value}
      <span className='text-lg text-gray-600 ml-2'>{unit}</span>
    </p>
    {trend && (
      <p className={`text-sm mt-2 ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
      </p>
    )}
  </Card>
);

export const LoadingSpinner = () => (
  <div className='flex justify-center items-center py-8'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
  </div>
);
