import { useCallback, useRef, useState } from 'react';

export interface ToastState {
  message: string;
  tone: 'success' | 'danger';
}

const TOAST_DURATION_MS = 2200;

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((message: string, tone: ToastState['tone'] = 'success') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ message, tone });
    timeoutRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  return { toast, showToast };
}
