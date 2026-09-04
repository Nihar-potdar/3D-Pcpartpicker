import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const Home = lazy(() =>
  import("./Pages/Home").then((module) => ({ default: module.Home })),
);

const Guide = lazy(() =>
  import("./Pages/Guide").then((module) => ({ default: module.Guide })),
);

const GuideDetail = lazy(() =>
  import("./Pages/GuideDetail").then((module) => ({
    default: module.GuideDetail,
  })),
);

function PageLoader() {
  return (
    <div className="landing-grid grid min-h-dvh place-items-center bg-background text-text">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
        Loading field manual...
      </span>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Guide />} />
          <Route path="/guides/:slug" element={<GuideDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
