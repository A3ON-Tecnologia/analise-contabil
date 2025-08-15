import React from 'react';

export function Select({ children }) {
  return <div>{children}</div>;
}

export function SelectTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SelectValue({ children, ...props }) {
  return <span {...props}>{children}</span>;
}

export function SelectContent({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SelectItem({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
