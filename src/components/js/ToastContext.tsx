"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'info' | 'warn' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  icon?: string;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType, icon?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', icon?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-4), { id, message, type, icon }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div 
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2" 
        aria-live="polite" 
        aria-label="Notifications"
      >
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md text-xs font-mono font-medium shadow-xl shadow-black/20"
              style={{
                backgroundColor: 'rgba(11, 15, 25, 0.9)',
                borderColor: t.type === 'success' ? 'rgba(56, 189, 248, 0.3)' : t.type === 'warn' ? 'rgba(251, 191, 36, 0.3)' : t.type === 'error' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(156, 163, 175, 0.2)',
                color: '#f8fafc',
              }}
              role="alert"
            >
              {t.icon && <span className="text-sm flex-shrink-0 drop-shadow-md">{t.icon}</span>}
              <span>{t.message}</span>
              <motion.div 
                className="absolute bottom-0 left-0 h-[2px] bg-sky-400" 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                style={{
                   backgroundColor: t.type === 'success' ? '#38bdf8' : t.type === 'warn' ? '#fbbf24' : t.type === 'error' ? '#f43f5e' : '#9ca3af'
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
