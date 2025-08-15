import React from 'react';

export function Alert({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function AlertDescription({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
