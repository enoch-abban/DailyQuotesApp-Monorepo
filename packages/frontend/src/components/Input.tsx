import React from 'react';

type InputProps = {
  name: string;
  placeholder: string;
  type?: 'text' | 'password' | 'email' | 'url' | 'number' | 'date' | 'tel' | 'time' | 'search';
  autocomplete?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({ placeholder, name='', type = 'text', autocomplete = undefined, value, onChange }) => (
  <input
    name={name}
    autoComplete={autocomplete}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="form-input w-full h-14 rounded-xl p-4 bg-[#E4E9F1] text-[#141C24] placeholder:text-[#3F5374] text-base font-normal focus:outline-0 focus:ring-0"
  />
);

export default Input;