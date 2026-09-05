import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Provides the semantic outer shell for guide cards.
 *
 * Native article props are forwarded so callers retain accessibility hooks,
 * while `cn` lets page-specific classes extend the shared visual language.
 *
 * @param {ComponentProps<"article">} props - Native article attributes plus an
 * optional className merged with the RetroForge card defaults.
 * @returns {JSX.Element} A semantic article element.
 * @remarks This component does not intentionally throw.
 */
function Card({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "offset-shadow-md relative flex flex-col overflow-hidden border border-border bg-surface",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Creates a clipping boundary for a card's visual header.
 *
 * @param {ComponentProps<"div">} props - Native div attributes and extensions.
 * @returns {JSX.Element} The card header container.
 * @remarks This component does not intentionally throw.
 */
function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("relative overflow-hidden", className)} {...props} />
  );
}

/**
 * Creates the flexible content region that pushes the footer to the card edge.
 *
 * @param {ComponentProps<"div">} props - Native div attributes and extensions.
 * @returns {JSX.Element} The card body container.
 * @remarks This component does not intentionally throw.
 */
function CardBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-1 flex-col p-5", className)} {...props} />
  );
}

/**
 * Creates a visually separated action region at the bottom of a card.
 *
 * @param {ComponentProps<"div">} props - Native div attributes and extensions.
 * @returns {JSX.Element} The card footer container.
 * @remarks This component does not intentionally throw.
 */
function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("border-t border-border p-5", className)} {...props} />
  );
}

export { Card, CardBody, CardFooter, CardHeader };
