import { ArrowUpRight, Clock3 } from "lucide-react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Link } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@/components/ui/material-card";
import { guides } from "@/data/guides";
import { cn } from "@/lib/utils";

// Every card reuses one reveal definition so scrolling through the collection
// feels coherent. The spring settles quickly to keep reading, not animation, as
// the primary activity on this page.
const guideReveal: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 17 },
  },
};

/**
 * Renders the guide library from the typed records in `data/guides.ts`.
 *
 * Keeping editorial content outside this component lets additional guides be
 * added without cloning card markup or route behavior. Material-style card
 * primitives supply structure while Motion adds restrained progressive reveal.
 *
 * @returns {JSX.Element} The guide introduction, guide-card grid, and footer.
 * @throws {Error} Link navigation requires the application Router, and imported
 * data/rendering failures propagate through React.
 */
export function Guide() {
  // Hover and ambient animation are optional decoration; content and links stay
  // identical when the operating system requests reduced motion.
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <main className="landing-grid motion-grid relative min-h-dvh overflow-hidden bg-background text-text">
        <NavBar variant="guides" />

        {/* This instrument-like marker connects the page to Home visually but
            is hidden from screen readers because it conveys no guide content. */}
        <motion.div
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -right-24 top-48 hidden size-56 rounded-full border border-dashed border-accent/20 lg:block"
        >
          <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          {/* The narrow second column explains the collection without weakening
              the large editorial headline on wide screens. */}
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
            {/* Each typed guide record owns its content, icon, route slug, and
                featured status; this map owns only the shared presentation. */}
            {guides.map((guide, index) => {
              // Capitalized local references allow icon constructors stored in
              // the data file to be rendered as React components.
              const Icon = guide.icon;
              const DetailIcon = guide.detailIcon;

              return (
                // A small index-based delay reveals reading order without a
                // long sequence that makes later cards feel unresponsive.
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
                          // Optional detail art creates variation while guides
                          // without a secondary icon keep the exact same layout.
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
                        {/* Topics are semantic list items so assistive technology
                            receives the same quick summary as sighted readers. */}
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
                      {/* Slug-based URLs are stable and human-readable, unlike an
                          array index that would change when guides are reordered. */}
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

          <Footer variant="guides" />
        </div>
      </main>
    </MotionConfig>
  );
}
