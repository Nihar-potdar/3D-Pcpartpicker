import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { DetailedErrors } from "@/data/type";

type CompatibilityWarningDialogProps = {
  issues: DetailedErrors[] | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function CompatibilityWarningDialog({
  issues,
  onCancel,
  onConfirm,
}: CompatibilityWarningDialogProps) {
  return (
    <AnimatePresence>
      {issues && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onCancel();
          }}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="compatibility-warning-title"
            aria-describedby="compatibility-warning-description"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="cut-corner w-full max-w-lg border border-danger/60 bg-background p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center border border-danger/50 bg-danger/15 text-danger">
                <AlertTriangle className="size-5" />
              </span>

              <div className="min-w-0">
                <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-danger">
                  Compatibility warning
                </p>
                <h2
                  id="compatibility-warning-title"
                  className="mt-1 text-xl font-bold uppercase italic font-display text-text"
                >
                  Install anyway?
                </h2>
              </div>
            </div>

            <p
              id="compatibility-warning-description"
              className="mt-4 text-sm leading-6 text-muted"
            >
              {issues[0]?.compatibilityIssue}
            </p>

            {issues.length > 1 && (
              <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-danger">
                Plus {issues.length - 1} more {issues.length === 2 ? "issue" : "issues"}
              </p>
            )}

            <p className="mt-4 border-l-2 border-danger bg-danger/10 px-3 py-2 text-xs leading-5 text-text">
              You can still install this component. The compatibility panel will
              keep showing the problem until the conflicting component is replaced
              or removed.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="h-10 border border-border px-4 font-mono text-[10px] font-bold uppercase tracking-wider text-muted transition hover:border-text hover:text-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="h-10 border border-danger bg-danger/15 px-4 font-mono text-[10px] font-bold uppercase tracking-wider text-danger transition hover:bg-danger hover:text-white"
              >
                Install anyway
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
