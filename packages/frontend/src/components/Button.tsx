import React from 'react';

type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary' }) => {
  const bgColor = variant === 'primary' ? 'bg-[#F4C753]' : 'bg-[#E4E9F1]';
  return (
    <button
      onClick={onClick}
      className={`${bgColor} text-[#141C24] text-base font-bold leading-normal tracking-[0.015em] w-full h-12 rounded-xl px-5 flex items-center justify-center`}
    >
      <span className="truncate">{text}</span>
    </button>
  );
};

export default Button;