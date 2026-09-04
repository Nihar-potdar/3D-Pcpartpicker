import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@/components/ui/material-card";
import { guides } from "@/data/guides";
import { cn } from "@/lib/utils";

const guideReveal: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 17 },
  },
};

export function Guide() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <main className="landing-grid motion-grid relative min-h-dvh overflow-hidden bg-background text-text">
        <motion.header
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-md"
        >
          <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 sm:px-10 lg:px-14">
            <div className="flex items-center gap-4">
              <motion.div
                aria-label="Return to home"
                whileHover={{ rotate: -8, scale: 1.06 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to="/"
                  className="grid size-9 place-items-center border border-border text-muted transition-colors hover:bg-accent-soft hover:text-text"
                >
                  <ArrowLeft className="size-4" />
                </Link>
              </motion.div>
              <span className="font-mono text-[10px] tracking-[0.25em] text-muted">
                RETROFORGE / FIELD MANUAL
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] sm:gap-3">
              <span className="hidden text-muted sm:inline">
                Knowledge base
              </span>
              <motion.span
                whileHover={{ rotate: 2, scale: 1.04 }}
                className="bg-accent-soft px-3 py-2 text-accent-dark"
              >
                Guides
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
              <ThemeToggle />
            </div>
          </div>
        </motion.header>

        <motion.div
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -right-24 top-48 hidden size-56 rounded-full border border-dashed border-accent/20 lg:block"
        >
          <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <section className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[1fr_22rem] lg:items-end">
            <motion.div
              variants={guideReveal}
              initial="hidden"
              animate="visible"
            >
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] text-accent-dark">
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: 0.18,
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-px w-10 origin-left bg-accent"
                />
                KNOWLEDGE BASE / 05 MODULES
              </div>
              <h1 className="max-w-5xl font-display text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
                <motion.span
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.08,
                    type: "spring",
                    stiffness: 100,
                    damping: 17,
                  }}
                  className="block"
                >
                  Build smarter.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 36, rotate: 1.5 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{
                    delay: 0.18,
                    type: "spring",
                    stiffness: 95,
                    damping: 15,
                  }}
                  className="block origin-left text-accent"
                >
                  Break less.
                </motion.span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.34, duration: 0.5 }}
              className="border-l-2 border-accent pl-5"
            >
              <p className="font-text text-base leading-relaxed text-muted">
                Short, practical explanations for the decisions that matter most
                in a first PC build.
              </p>
              <div className="mt-5 flex gap-6 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                <span>05 guides</span>
                <span>36 min total</span>
              </div>
            </motion.div>
          </section>

          <section
            aria-label="PC building guides"
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              const DetailIcon = guide.detailIcon;

              return (
                <motion.div
                  key={guide.number}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.16 }}
                  variants={guideReveal}
                  transition={{ delay: index * 0.07 }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -9,
                          rotate: index % 2 === 0 ? -0.6 : 0.6,
                          scale: 1.01,
                        }
                  }
                  className={cn(
                    guide.featured && "md:col-span-2 xl:min-h-[30rem]",
                  )}
                >
                  <Card
                    className={cn(
                      "group h-full min-h-[28rem]",
                      guide.featured && "xl:min-h-[30rem]",
                    )}
                  >
                    <CardHeader
                      className={cn(
                        "guide-card-grid m-2 flex h-40 items-end justify-between bg-accent-soft p-5",
                        guide.featured && "sm:h-52",
                      )}
                    >
                      <span className="font-mono text-[10px] tracking-[0.2em] text-accent-dark">
                        MODULE_{guide.number}
                      </span>
                      <motion.div
                        whileHover={{
                          rotate: index % 2 === 0 ? 8 : -8,
                          scale: 1.08,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 13,
                        }}
                        className="relative"
                      >
                        {DetailIcon && (
                          <DetailIcon
                            className="absolute -left-14 -top-8 size-16 text-accent/20"
                            strokeWidth={1}
                          />
                        )}
                        <Icon
                          className="size-16 text-accent sm:size-20"
                          strokeWidth={1.2}
                        />
                      </motion.div>
                    </CardHeader>

                    <CardBody className="p-6">
                      <div className="mb-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                        <span>{guide.level}</span>
                        <span className="flex items-center gap-1.5">
                          <Clock3 className="size-3" />
                          {guide.duration}
                        </span>
                      </div>

                      <h2 className="font-display text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                        {guide.title}
                      </h2>
                      <p className="mt-4 max-w-2xl font-text text-sm leading-relaxed text-muted sm:text-base">
                        {guide.description}
                      </p>

                      <ul
                        className="mt-6 flex flex-wrap gap-2"
                        aria-label={`${guide.title} topics`}
                      >
                        {guide.topics.map((topic) => (
                          <motion.li
                            key={topic}
                            whileHover={{ y: -2, rotate: -1 }}
                            className="border border-border bg-background px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted"
                          >
                            {topic}
                          </motion.li>
                        ))}
                      </ul>
                    </CardBody>

                    <CardFooter className="p-0">
                      <Link
                        to={`/guides/${guide.slug}`}
                        className="flex w-full items-center justify-between px-6 py-4 font-text text-sm font-medium transition-colors hover:bg-accent hover:text-white"
                      >
                        Open guide
                        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </section>

          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-14 flex flex-col gap-3 border-t border-border pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted sm:flex-row sm:items-center sm:justify-between"
          >
            <span>RetroForge field manual / Revision 01</span>
            <span>Read first. Build once.</span>
          </motion.footer>
        </div>
      </main>
    </MotionConfig>
  );
}
