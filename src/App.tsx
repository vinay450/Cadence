
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
        <div className="min-h-screen bg-white dark:bg-gray-800">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <main className="pt-16">
                  <Hero />
                  <section id="try-app" className="bg-gray-50 dark:bg-gray-900 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold mb-6">
                          🚀 Try Our Analytics Platform Live
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                          Experience 5x Token Efficiency
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                          Upload your CSV data below and see how our revolutionary AI delivers the same insights as Claude and OpenAI using only 20% of the tokens.
                        </p>
                      </div>
                      <AnalysisApp />
                    </div>
                  </section>
                  <section id="features">
                    <TechnicalFeatures />
                  </section>
                  <section id="comparison">
                    <ComparisonSection />
                  </section>
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
