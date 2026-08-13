'use client';

import React from 'react';

interface VariableLettersProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  [key: string]: any;
}

export default function VariableLetters({
  children,
  as: Component = 'span',
  className = '',
  duration = 400,
  ...props
}: VariableLettersProps) {
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
}
