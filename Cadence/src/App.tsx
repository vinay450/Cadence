import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Analysis from "@/pages/Analysis";

export default function App() {
  return (
    <>
      <Toaster />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Analysis />} />
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}
