import { motion } from "motion/react";
import { Link } from "react-router-dom";

/**
 * Describes the page-specific information required by the shared footer.
 * The union prevents one page from accidentally depending on another page's
 * status fields.
 */
type FooterProps =
  | { variant: "home"; selectedComponent: string }
  | { variant: "guides" }
  | { variant: "guide-detail"; moduleNumber: string };

/**
 * Renders a compact status footer without duplicating layout across pages.
 *
 * @param {FooterProps} props - Chooses the footer variant and provides the
 * selected category or guide module number when that variant requires it.
 * @returns {JSX.Element} A page-appropriate footer using shared design tokens.
 * @remarks This component does not intentionally throw; router errors from the
 * detail-page link are propagated through React.
 */
export function Footer(props: FooterProps) {
  // Home uses live UI state, so it gets its own three-column status treatment.
  if (props.variant === "home") {
    return (
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="grid shrink-0 grid-cols-3 border-t border-border pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
      >
        <span>Compatibility engine / Active</span>
        <span className="text-center">
          Selected / {props.selectedComponent}
        </span>
        <span className="text-right">RetroForge / 2026</span>
      </motion.footer>
    );
  }

  // The guide index is editorial rather than interactive, so its footer carries
  // revision information instead of pretending to expose application status.
  if (props.variant === "guides") {
    return (
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
    );
  }

  // Reaching this branch is type-safe: the earlier checks leave only the
  // guide-detail variant, where moduleNumber is guaranteed to exist.
  return (
    <footer className="mt-12 flex items-center justify-between border-t border-border pt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
      <span>Module_{props.moduleNumber} complete</span>
      <Link to="/guides" className="text-accent-dark hover:underline">
        View all guides
      </Link>
    </footer>
  );
}
