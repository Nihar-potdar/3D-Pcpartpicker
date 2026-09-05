import { ArrowLeft, Bookmark, GitCompareArrows } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Restricts navigation variants at compile time.
 *
 * The discriminated union makes `moduleNumber` mandatory only for a detail
 * page, preventing the footer-like module label from rendering as undefined.
 */
type NavBarProps =
  | { variant: "home" | "build" }
  | { variant: "guides" }
  | { variant: "guide-detail"; moduleNumber: string };

/**
 * Renders the shared RetroForge navigation in its workspace or guide form.
 *
 * @param {NavBarProps} props - Selects the navigation layout and, for a guide
 * detail page, supplies the module number shown in the breadcrumb label.
 * @returns {JSX.Element} The navigation header appropriate for the page.
 * @throws {Error} The Home and Build variants require a `SidebarProvider`
 * ancestor because their `SidebarTrigger` consumes that React context.
 */
export function NavBar(props: NavBarProps) {
  // Motion's accessibility hook lets decorative movement disappear without
  // maintaining an entirely separate navigation implementation.
  const shouldReduceMotion = useReducedMotion();

  // Home and Build share the same application-shell controls. Keeping them in
  // one branch prevents their sidebar and theme behaviors from drifting apart.
  if (props.variant === "home" || props.variant === "build") {
    return (
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md sm:px-8"
      >
        <div className="flex items-center gap-3">
          <SidebarTrigger className="rounded-none border border-border" />
          <span className="font-mono text-[10px] tracking-[0.28em] text-muted">
            {props.variant === "build" ? "BUILD_OS / 01" : "RF_OS / 01"}
          </span>
        </div>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-1 sm:gap-3"
        >
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="nav-link"
          >
            <GitCompareArrows className="size-4" />
            <span className="hidden sm:inline">Compare</span>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="nav-link"
          >
            <Bookmark className="size-4" />
            <span className="hidden sm:inline">Saved</span>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="nav-link nav-link-active"
          >
            <span>Build</span>
            {/* The pulse is a status accent, not information; reduced-motion
                users receive the same active styling without repetition. */}
            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : { opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-1.5 w-1.5 rounded-full bg-current"
            />
          </motion.button>
          <ThemeToggle />
        </nav>
      </motion.header>
    );
  }

  // Guide pages use a reading-focused header and do not need the build sidebar.
  const isGuideDetail = props.variant === "guide-detail";

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md"
    >
      <div
        className={`mx-auto flex h-16 items-center justify-between px-5 sm:px-10 ${
          isGuideDetail ? "max-w-[1180px]" : "max-w-[1500px] lg:px-14"
        }`}
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.06 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* A detail page steps back to the guide index, while the guide
                index steps back to Home. This preserves the reading hierarchy. */}
            <Link
              to={isGuideDetail ? "/guides" : "/"}
              aria-label={
                isGuideDetail ? "Return to all guides" : "Return to home"
              }
              className="grid size-9 place-items-center border border-border text-muted transition-colors hover:bg-accent-soft hover:text-text"
            >
              <ArrowLeft className="size-4" />
            </Link>
          </motion.div>

          <span className="font-mono text-[9px] tracking-[0.2em] text-muted sm:text-[10px] sm:tracking-[0.25em]">
            {isGuideDetail
              ? `FIELD MANUAL / MODULE_${props.moduleNumber}`
              : "RETROFORGE / FIELD MANUAL"}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] sm:gap-3">
          {isGuideDetail ? (
            <Link
              to="/"
              className="hidden text-[9px] tracking-[0.16em] text-muted transition-colors hover:text-text sm:block"
            >
              Home
            </Link>
          ) : (
            <>
              <span className="hidden text-muted sm:inline">
                Knowledge base
              </span>
              <motion.span
                whileHover={{ rotate: 2, scale: 1.04 }}
                className="bg-accent-soft px-3 py-2 text-accent-dark"
              >
                Guides
                {/* This dot is deliberately decorative; the text already
                    communicates the active section to every user. */}
                <motion.span
                  animate={
                    shouldReduceMotion ? undefined : { opacity: [1, 0.25, 1] }
                  }
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  {" "}
                  •
                </motion.span>
              </motion.span>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
