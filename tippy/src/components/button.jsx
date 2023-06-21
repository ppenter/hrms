import React from 'react';

const Button = ({ variant, type, className,children, ...rest }) => {
  // Define the class based on the variant and type props
  let buttonClasses = 'font-bold py-2 px-4 rounded border-none hover:opacity-50';
  
  if (variant === 'primary') {
    if (type === 'outlined') {
      buttonClasses += ' text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500';
    } else if (type === 'clear') {
      buttonClasses += ' text-blue-500 hover:text-blue-600 hover:bg-blue-100 bg-transparent';
    } else {
      buttonClasses += ' bg-blue-500 hover:bg-blue-600 text-white';
    }
  } else if (variant === 'secondary') {
    if (type === 'outlined') {
      buttonClasses += ' text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-500';
    } else if (type === 'clear') {
      buttonClasses += ' text-gray-500 hover:text-gray-600 hover:bg-gray-100 bg-transparent';
    } else {
      buttonClasses += ' bg-gray-500 hover:bg-gray-600 text-white';
    }
  } else if (variant === 'danger') {
    if (type === 'outlined') {
      buttonClasses += ' text-red-500 border border-red-500 hover:text-white hover:bg-red-500';
    } else if (type === 'clear') {
      buttonClasses += ' text-red-500 hover:text-white hover:bg-red-500 bg-transparent';
    } else {
      buttonClasses += ' bg-red-500 hover:bg-red-600 text-white';
    }
  }

  // Combine user-defined classes with dynamic classes
  buttonClasses += ` ${className}`;

  return (
    <button className={buttonClasses} {...rest}>
      {children}
    </button>
  );
};

export default Button;