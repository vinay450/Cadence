
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TechnicalFeatures from "@/components/TechnicalFeatures";
import ComparisonSection from "@/components/ComparisonSection";
import AnalysisApp from "@/pages/Analysis";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <>
      <Toaster />
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <main className="pt-16">
                  <Hero />
                  <section id="features">
                    <TechnicalFeatures />
                  </section>
                  <section id="comparison">
                    <ComparisonSection />
                  </section>
                  <AnalysisApp />
                </main>
                <Footer />
              </>
            } />
            <Route path="/analysis" element={<AnalysisApp />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}
