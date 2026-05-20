import { Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import ContentSection from "./components/ContentSection";
import Loader1 from "./components/Loader1";
import Loader2 from "./components/Loader2";
import Loader3 from "./components/Loader3";
import Loader4 from "./components/Loader4";

function App() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <div className="size-full">
            <Hero />
            <ContentSection />
          </div>
        } 
      />
      <Route path="/Item1" element={<Loader1 />} />
      <Route path="/Item2" element={<Loader2 />} />
      <Route path="/Item3" element={<Loader3 />} />
      <Route path="/Item4" element={<Loader4 />} />
    </Routes>
  );
}

export default App;
