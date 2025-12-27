import React, { createContext, useContext } from "react";
import { motion } from "framer-motion";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children, open, setOpen, animate = true }) => {
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate = true }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = ({ className, children, ...props }) => {
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden md:flex-row ${className || ''}`}
      {...props}
    >
      <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SidebarLink = ({ link, className, onClick, ...props }) => {
  const { open, animate } = useSidebar();
  return (
    <div
      onClick={onClick}
      className={`group/sidebar flex items-center justify-start gap-2 py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700 transition duration-150 cursor-pointer ${className || ''}`}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </div>
  );
};