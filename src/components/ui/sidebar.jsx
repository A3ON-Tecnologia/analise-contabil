import React from 'react';

export function Sidebar({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export const SidebarContent = Sidebar;
export const SidebarGroup = Sidebar;
export const SidebarGroupContent = Sidebar;
export const SidebarGroupLabel = Sidebar;
export const SidebarMenu = Sidebar;
export const SidebarMenuButton = Sidebar;
export const SidebarMenuItem = Sidebar;
export const SidebarHeader = Sidebar;
export const SidebarFooter = Sidebar;
export const SidebarProvider = ({ children }) => <div>{children}</div>;
export const SidebarTrigger = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);
