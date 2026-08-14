import { createRoot } from "react-dom/client";
import { Canvas } from "./react-three-fiber";

function App() {
  return (
    <div id="canvas-container">
      <Canvas />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

export default App;
