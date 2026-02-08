
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-card rounded-[2rem] shadow-xl p-6 md:p-8 border border-border ${className}`}>
      <h3 className="text-base md:text-lg font-black text-white mb-6 uppercase tracking-widest">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;
