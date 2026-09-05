import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Route-level lazy loading keeps the Three.js build workspace out of the much
// lighter Home and Guides bundles. This matters because WebGL dependencies are
// large and should not delay a visitor who has not opened the builder yet.
const Home = lazy(() =>
  import("./Pages/Home").then((module) => ({ default: module.Home })),
);

const BuildPage = lazy(() =>
  import("./Pages/BuildPage").then((module) => ({ default: module.BuildPage })),
);

const Guide = lazy(() =>
  import("./Pages/Guide").then((module) => ({ default: module.Guide })),
);

const GuideDetail = lazy(() =>
  import("./Pages/GuideDetail").then((module) => ({
    default: module.GuideDetail,
  })),
);

/**
 * Provides a design-system-consistent fallback while a lazy route is loading.
 *
 * The fallback lives outside individual pages so every route transition has
 * the same behavior and we do not duplicate loading-state markup.
 *
 * @returns {JSX.Element} A full-viewport loading indicator.
 * @remarks This function does not intentionally throw. Lazy-import failures are
 * propagated by React and should eventually be handled by an error boundary.
 */
function PageLoader() {
  return (
    <div className="landing-grid grid min-h-dvh place-items-center bg-background text-text">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
        Loading RetroForge...
      </span>
    </div>
  );
}

/**
 * Defines the client-side routing boundary for the RetroForge application.
 *
 * @returns {JSX.Element} The router and whichever page matches the current URL.
 * @throws {Error} React Router can throw if another router is mounted above
 * this component; `App` is therefore intended to be the single router owner.
 */
export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Keep the primary user journey on short, predictable URLs. */}
          <Route path="/" element={<Home />} />
          <Route path="/build" element={<BuildPage />} />
          {/* Preserve old bookmarks while standardizing the canonical route. */}
          <Route path="/BuildPage" element={<Navigate to="/build" replace />} />
          <Route path="/guides" element={<Guide />} />
          <Route path="/guides/:slug" element={<GuideDetail />} />
          {/* An unknown path should recover into the app instead of dead-ending. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
