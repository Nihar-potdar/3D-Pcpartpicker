import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const savedTheme = window.localStorage.getItem("retroforge-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDark = theme === "dark";

  function toggleTheme() {
    const nextTheme: Theme = isDark ? "light" : "dark";

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
