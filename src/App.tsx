import { lazy, Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
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

const Prebuilts = lazy(() =>
  import("./Pages/PreBuilts").then((module) => ({
    default: module.Prebuilts,
  })),
);

function PageLoader() {
  return (
    <div className="grid landing-grid min-h-dvh place-items-center bg-background text-text">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
        Loading RetroForge...
      </span>
    </div>
  );
}
export function App() {
  return (
    <HashRouter>
      <Toaster />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Keep the primary user journey on short, predictable URLs. */}
          <Route path="/" element={<Home />} />
          <Route path="/build" element={<BuildPage />} />
          {/* Preserve old bookmarks while standardizing the canonical route. */}
          <Route path="/BuildPage" element={<Navigate to="/build" replace />} />
          <Route path="/guides" element={<Guide />} />
          <Route path="/guides/:slug" element={<GuideDetail />} />
          <Route path="/prebuilts" element={<Prebuilts />} />
          {/* An unknown path should recover into the app instead of dead-ending. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
