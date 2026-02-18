
import { useEffect } from "react";
import { DiagramCanvas } from "../components/DiagramCanvas";
const Index = () => {
  useEffect(() => {
    document.title = "Basically - Visual Diagram Editor";
  }, []);
  return (
    <div className="w-full h-screen overflow-hidden">
      <DiagramCanvas />
    </div>
  );
};

export default Index;
