import type { ToastState } from '@/hooks/useToast';
import { CheckIcon, AlertIcon } from '@/components/icons';

export function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;

  const isSuccess = toast.tone === 'success';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div
        className={`animate-popIn pointer-events-auto flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium shadow-elevated ${
          isSuccess
            ? 'border-success/30 bg-success/10 text-success'
            : 'border-danger/30 bg-danger/10 text-danger'
        }`}
      >
        {isSuccess ? <CheckIcon /> : <AlertIcon />}
        {toast.message}
      </div>
    </div>
  );
}
