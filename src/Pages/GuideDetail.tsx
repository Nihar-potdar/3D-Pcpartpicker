import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Clock3,
  ExternalLink,
} from "lucide-react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { Link, Navigate, useParams } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";
import { guides } from "@/data/guides";

export function GuideDetail() {
  const { slug } = useParams();
  const guide = guides.find((item) => item.slug === slug);
  const shouldReduceMotion = useReducedMotion();

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  const Icon = guide.icon;

  return (
    <MotionConfig reducedMotion="user">
      <main className="landing-grid motion-grid min-h-dvh bg-background text-text">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md"
        >
          <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-10">
            <div className="flex items-center gap-4">
              <Link
                to="/guides"
                aria-label="Return to all guides"
                className="grid size-9 place-items-center border border-border text-muted transition-colors hover:bg-accent-soft hover:text-text"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <span className="font-mono text-[9px] tracking-[0.2em] text-muted sm:text-[10px] sm:tracking-[0.25em]">
                FIELD MANUAL / MODULE_{guide.number}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-text sm:block"
              >
                Home
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </motion.header>

        <article className="mx-auto max-w-[1180px] px-5 py-10 sm:px-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
            className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-dark">
                <span>{guide.level}</span>
                <span>/</span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-3" />
                  {guide.duration}
                </span>
              </div>
              <h1 className="max-w-4xl font-display text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.06em]">
                {guide.title}
              </h1>
              <p className="mt-6 max-w-3xl border-l-2 border-accent pl-5 font-text text-base leading-relaxed text-muted sm:text-lg">
                {guide.description}
              </p>
            </div>

            <motion.div
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { rotate: [0, 5, -4, 0], y: [0, -5, 0] }
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="hidden size-24 place-items-center border border-border bg-accent-soft text-accent lg:grid"
            >
              <Icon className="size-12" strokeWidth={1.2} />
            </motion.div>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="offset-shadow-lg mt-10 border border-border bg-surface p-2"
          >
            <img
              src={guide.image}
              alt={guide.imageAlt}
              className="h-[18rem] w-full object-cover grayscale-[20%] sm:h-[28rem]"
            />
            <figcaption className="flex flex-col gap-1 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
              <span>{guide.imageAlt}</span>
              <a
                href={guide.imageSource}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-accent-dark hover:underline"
              >
                {guide.imageCredit}
                <ExternalLink className="size-3" />
              </a>
            </figcaption>
          </motion.figure>

          <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
            <div>
              <div className="border border-border bg-accent-soft p-6 sm:p-8">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-dark">
                  The one thing to remember
                </p>
                <p className="mt-3 max-w-3xl font-display text-2xl font-medium leading-snug sm:text-3xl">
                  {guide.keyIdea}
                </p>
              </div>

              <div className="mt-10 space-y-10">
                {guide.sections.map((section, index) => (
                  <motion.section
                    key={section.title}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    className="grid gap-4 sm:grid-cols-[3rem_1fr]"
                  >
                    <span className="font-mono text-sm text-accent-dark">
                      0{index + 1}
                    </span>
                    <div>
                      <h2 className="font-display text-3xl font-medium tracking-[-0.03em]">
                        {section.title}
                      </h2>
                      <p className="mt-3 max-w-3xl font-text leading-relaxed text-muted">
                        {section.body}
                      </p>
                    </div>
                  </motion.section>
                ))}
              </div>
            </div>

            <aside className="border border-border bg-surface p-5 lg:sticky lg:top-24">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                Before you continue
              </p>
              <h2 className="mt-2 font-display text-2xl font-medium">
                Quick check
              </h2>
              <ul className="mt-5 space-y-4">
                {guide.checklist.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 font-text text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center bg-accent-soft text-accent-dark">
                      <Check className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <section className="mt-12 flex gap-4 border-l-4 border-warning bg-surface p-5 sm:p-6">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
            <div>
              <h2 className="font-display text-lg font-medium">Watch out</h2>
              <p className="mt-1 font-text text-sm leading-relaxed text-muted">
                {guide.warning}
              </p>
            </div>
          </section>

          <footer className="mt-12 flex items-center justify-between border-t border-border pt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
            <span>Module_{guide.number} complete</span>
            <Link to="/guides" className="text-accent-dark hover:underline">
              View all guides
            </Link>
          </footer>
        </article>
      </main>
    </MotionConfig>
  );
}
