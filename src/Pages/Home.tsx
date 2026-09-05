import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useNavigate } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { ComponentSidebar } from "@/components/ui/Nav/ComponentSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Actions are data rather than repeated JSX so their ordering, labels, and
// destinations remain one source of truth. `path` is optional on purpose: the
// unfinished Load Builds action remains visually reviewable without navigating
// users to a broken  page.
const quickActions = [
  {
    label: "Start Build",
    description: "Choose parts and check compatibility",
    number: "01",
    primary: true,
    path: "/build",
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

// The parent variant only coordinates timing. Child elements opt into the
// matching reveal variant, producing a readable sequence without manual delays.
const staggeredReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.1,
    },
  },
};

// A shared spring makes separate hero elements feel like one system and avoids
// slightly different animation physics being copied throughout the page.
const revealItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 105, damping: 18 },
  },
};

/**
 * Renders the RetroForge landing page and its top-level navigation choices.
 *
 * The sidebar selection on Home is presentation state used to preview the part
 * categories. Actual product selection belongs to BuildPage, which prevents the
 * landing screen from becoming a second, conflicting build editor.
 *
 * @returns {JSX.Element} The responsive hero, command menu, sidebar, and footer.
 * @throws {Error} `useNavigate` requires this page to be rendered inside the
 * application's React Router; routing errors are allowed to surface normally.
 */
export function Home() {
  // CPU provides a deterministic first label even though the sidebar begins
  // collapsed; no component is silently added to a user's build here.
  const [selectedComponent, setSelectedComponent] = useState("cpu");
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  return (
    <MotionConfig reducedMotion="user">
      {/* Home starts collapsed to protect the hero composition. The always-
          visible header trigger still makes the part index discoverable. */}
      <SidebarProvider defaultOpen={false} className="min-h-dvh bg-background text-text">
        <ComponentSidebar
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
        />

        <SidebarInset className="landing-grid motion-grid min-h-dvh overflow-hidden bg-background">
          <NavBar variant="home" />

          <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 py-8 sm:px-10 sm:py-12 lg:px-14 xl:px-20">
            {/* Oversized initials add depth without communicating information,
                so they are hidden from assistive technology and large screens
                are the only devices that pay their layout/animation cost. */}
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

            {/* The slow orbiting marker repeats the technical-instrument motif.
                It is disabled when reduced motion is requested. */}
            <motion.div
              aria-hidden="true"
              animate={shouldReduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute -right-10 bottom-[18%] hidden size-32 rounded-full border border-dashed border-accent/20 lg:block"
            >
              <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 bg-accent" />
            </motion.div>

            {/* One responsive grid keeps the story and command menu connected:
                stacked on small screens, balanced side-by-side on desktop. */}
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
                  <motion.span variants={revealItem} className="block origin-left">
                    Retro
                  </motion.span>
                  {/* This title half uses a directional reveal so the brand
                      lockup feels assembled rather than uniformly faded. */}
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
                    Build a machine that fits together before buying a single part. Pick components,
                    inspect them in 3D, and catch compatibility problems early.
                  </p>
                  <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    Status / Ready
                  </span>
                </motion.div>
              </motion.div>

              {/* The menu enters from the opposite side of the hero, reinforcing
                  the two-column composition without continuous movement. */}
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
                    <p className="mt-1 font-display text-xl font-medium">Choose an action</p>
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    {/* Changing the key tells AnimatePresence this is new status
                        text, so the previous category exits before the next enters. */}
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
                  {/* A missing path deliberately leaves unfinished actions inert.
                      Only the primary journey receives the filled accent; other
                      choices remain visible but visually quieter. */}
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

            <Footer variant="home" selectedComponent={selectedComponent} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </MotionConfig>
  );
}
