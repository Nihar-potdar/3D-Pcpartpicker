import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

/** The two supported themes intentionally share one restrained color system. */
type Theme = "light" | "dark";

/**
 * Resolves the first theme used by the interactive toggle.
 *
 * A saved preference takes priority so the application respects a decision the
 * user already made. The system preference is only used when no choice exists.
 *
 * @returns {Theme} Either `"light"` or `"dark"`.
 * @throws {DOMException} Browser privacy settings can reject localStorage
 * access; this low-level browser error is intentionally allowed to surface.
 */
function getInitialTheme(): Theme {
  // This key is shared with main.tsx, which applies the class before React
  // mounts. Keeping the contract identical avoids a theme mismatch on startup.
  const savedTheme = window.localStorage.getItem("retroforge-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Gives the user a persistent light/dark mode control.
 *
 * @returns {JSX.Element} An accessible icon button describing the next theme.
 * @throws {DOMException} localStorage may reject writes in restricted browsing
 * environments; no server request or database interaction occurs.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDark = theme === "dark";

  /**
   * Applies and persists the opposite theme.
   *
   * The DOM class, persistent value, and React state are updated together so
   * CSS, future page loads, and the button icon all describe the same theme.
   *
   * @returns {void}
   * @throws {DOMException} If the browser blocks the localStorage write.
   */
  function toggleTheme() {
    const nextTheme: Theme = isDark ? "light" : "dark";

    // CSS variables are switched at the document root so portals and every
    // routed page inherit the theme without prop drilling.
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("retroforge-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ y: -2, rotate: isDark ? -5 : 5 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="grid size-9 place-items-center border border-border bg-background text-muted transition-colors hover:bg-accent-soft hover:text-text"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </motion.button>
  );
}
