// src/hooks/useToast.ts
import { useState, useCallback, useRef } from 'react';

export function useToast(durationMs = 2200) {
  const [toast, setToast] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(msg);
    timerRef.current = setTimeout(() => setToast(''), durationMs);
  }, [durationMs]);

  return { toast, showToast };
}
