import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

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

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("relative overflow-hidden", className)} {...props} />
  );
}

function CardBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-1 flex-col p-5", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("border-t border-border p-5", className)} {...props} />
  );
}

export { Card, CardBody, CardFooter, CardHeader };
