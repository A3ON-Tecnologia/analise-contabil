import React from 'react';

export function Progress({ value = 0, max = 100, ...props }) {
  return <progress value={value} max={max} {...props} />;
}
