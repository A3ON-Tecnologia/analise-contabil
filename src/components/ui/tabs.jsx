import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
}

export function TabsList({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function TabsTrigger({ value, children, ...props }) {
  const { setValue } = useContext(TabsContext);
  return (
    <button onClick={() => setValue(value)} {...props}>
      {children}
    </button>
  );
}

export function TabsContent({ value, children, ...props }) {
  const { value: current } = useContext(TabsContext);
  if (current !== value) return null;
  return <div {...props}>{children}</div>;
}
