import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { vars } from '@/styles/theme.css';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 24,
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderRadius: 12,
        backgroundColor:
          toast.type === 'success' ? 'rgba(30, 142, 62, 0.92)' : 'rgba(229, 0, 18, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 500,
        boxShadow: vars.shadow.lg,
        minWidth: 240,
        border: `1px solid ${toast.type === 'success' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)'}`,
      }}
    >
      {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          opacity: 0.7,
        }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
