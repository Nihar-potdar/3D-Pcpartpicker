import { useSidebar } from "../sidebar";
import { LuAlignLeft } from "react-icons/lu";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar}>
      <LuAlignLeft />
    </button>
  );
}
