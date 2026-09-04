import { useState } from "react";
import { ArrowUpRight, Bookmark, GitCompareArrows } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useNavigate } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";
import { ComponentSidebar } from "@/components/ui/Nav/ComponentSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const quickActions = [
  {
    label: "Start Build",
    description: "Choose parts and check compatibility",
    number: "01",
    primary: true,
  },
  {
    label: "Load Builds",
    description: "Continue a configuration you saved",
    number: "02",
  },
  {
    label: "Guides",
    description: "Learn what each component does",
    number: "03",
    path: "/guides",
  },
];

const staggeredReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.1,
    },
  },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 105, damping: 18 },
  },
};

export function Home() {
  const [selectedComponent, setSelectedComponent] = useState("cpu");
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  return (
    <MotionConfig reducedMotion="user">
      <SidebarProvider className="min-h-dvh bg-background text-text">
        <ComponentSidebar
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
        />

        <SidebarInset className="landing-grid motion-grid min-h-dvh overflow-hidden bg-background">
          <motion.header
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md sm:px-8"
          >
            <div className="flex items-center gap-3">
              <SidebarTrigger className="rounded-none border border-border md:hidden" />
              <span className="font-mono text-[10px] tracking-[0.28em] text-muted">
                RF_OS / 01
              </span>
            </div>

            <nav
              aria-label="Primary navigation"
              className="flex items-center gap-1 sm:gap-3"
            >
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="nav-link"
              >
                <GitCompareArrows className="size-4" />
                <span className="hidden sm:inline">Compare</span>
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="nav-link"
              >
                <Bookmark className="size-4" />
                <span className="hidden sm:inline">Saved</span>
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="nav-link nav-link-active"
              >
                <span>Build</span>
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

          <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 py-8 sm:px-10 sm:py-12 lg:px-14 xl:px-20">
            <motion.div
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -14, 0],
                      rotate: [0, 1.5, 0],
                      scale: [1, 1.025, 1],
                    }
              }
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute right-[8%] top-[8%] hidden font-mono text-[clamp(10rem,25vw,24rem)] font-bold leading-none text-accent/[0.045] xl:block"
            >
              RF
            </motion.div>

            <motion.div
              aria-hidden="true"
              animate={shouldReduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute -right-10 bottom-[18%] hidden size-32 rounded-full border border-dashed border-accent/20 lg:block"
            >
              <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 bg-accent" />
            </motion.div>

            <motion.section
              variants={staggeredReveal}
              initial="hidden"
              animate="visible"
              className="grid flex-1 items-center gap-12 py-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-16"
            >
              <motion.div variants={staggeredReveal} className="max-w-4xl">
                <motion.div
                  variants={revealItem}
                  className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] text-accent-dark"
                >
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-px w-10 origin-left bg-accent"
                  />
                  3D PC CONFIGURATOR
                </motion.div>

                <motion.h1
                  variants={staggeredReveal}
                  className="font-display text-[clamp(4rem,11vw,9.5rem)] font-semibold leading-[0.78] tracking-[-0.075em] text-text"
                >
                  <motion.span
                    variants={revealItem}
                    className="block origin-left"
                  >
                    Retro
                  </motion.span>
                  <motion.span
                    variants={{
                      hidden: { opacity: 0, x: -36, rotate: -2 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        rotate: 0,
                        transition: {
                          type: "spring",
                          stiffness: 95,
                          damping: 14,
                        },
                      },
                    }}
                    className="block origin-left text-accent"
                  >
                    Forge.
                  </motion.span>
                </motion.h1>

                <motion.div
                  variants={revealItem}
                  className="mt-8 grid max-w-2xl gap-5 border-l-2 border-accent pl-5 sm:grid-cols-[1fr_auto] sm:items-end"
                >
                  <p className="max-w-xl font-text text-base leading-relaxed text-muted sm:text-lg">
                    Build a machine that fits together before buying a single
                    part. Pick components, inspect them in 3D, and catch
                    compatibility problems early.
                  </p>
                  <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    Status / Ready
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 48, rotate: 1.5 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    rotate: 0,
                    transition: { type: "spring", stiffness: 90, damping: 18 },
                  },
                }}
                whileHover={{ y: -4, rotate: -0.35 }}
                className="offset-shadow-lg w-full border border-border bg-surface/85 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.22em] text-muted">
                      COMMAND MENU
                    </p>
                    <p className="mt-1 font-display text-xl font-medium">
                      Choose an action
                    </p>
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={selectedComponent}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="font-mono text-[10px] uppercase tracking-wider text-accent-dark"
                    >
                      {selectedComponent} selected
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="p-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.label}
                      type="button"
                      onClick={() => action.path && navigate(action.path)}
                      initial={{ opacity: 0, x: 22 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.48 + index * 0.09, duration: 0.4 }}
                      whileHover={{ x: 7 }}
                      whileTap={{ scale: 0.985 }}
                      className={`group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-border px-3 py-5 text-left transition-colors last:border-b-0 ${
                        action.primary
                          ? "bg-accent text-white hover:brightness-90"
                          : "hover:bg-accent-soft"
                      }`}
                    >
                      <span
                        className={`font-mono text-[10px] ${
                          action.primary ? "text-white/65" : "text-muted"
                        }`}
                      >
                        {action.number}
                      </span>
                      <span>
                        <span className="block font-display text-2xl font-medium sm:text-3xl">
                          {action.label}
                        </span>
                        <span
                          className={`mt-1 block font-text text-xs sm:text-sm ${
                            action.primary ? "text-white/70" : "text-muted"
                          }`}
                        >
                          {action.description}
                        </span>
                      </span>
                      <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.section>

            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="grid shrink-0 grid-cols-3 border-t border-border pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
            >
              <span>Compatibility engine / Active</span>
              <span className="text-center">
                Selected / {selectedComponent}
              </span>
              <span className="text-right">RetroForge / 2026</span>
            </motion.footer>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </MotionConfig>
  );
}
