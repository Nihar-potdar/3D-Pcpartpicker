import { useRef, type ReactNode, type TouchEvent } from "react";

type PullDownToCloseProps = {
  children: ReactNode;
  onClose: () => void;
};

export function PullDownToClose({
  children,
  onClose,
}: PullDownToCloseProps) {
  const startY = useRef(0);
  const pulling = useRef(false);

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const element = event.currentTarget;

    if (element.scrollTop <= 0) {
      startY.current = event.touches[0].clientY;
      pulling.current = true;
    } else {
      pulling.current = false;
    }
  }

  function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (!pulling.current) return;

    const element = event.currentTarget;

    if (element.scrollTop > 0) {
      pulling.current = false;
      return;
    }

    const distance = event.touches[0].clientY - startY.current;

    if (distance > 45) {
      pulling.current = false;
      onClose();
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => {
        pulling.current = false;
      }}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
    >
      {children}
    </div>
  );
}
