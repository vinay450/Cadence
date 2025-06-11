import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TechnicalFeatures from "@/components/TechnicalFeatures";
import ComparisonSection from "@/components/ComparisonSection";
import AnalysisApp from "@/pages/Analysis";
import Login from "@/pages/Login";
import Documentation from "@/pages/Documentation";
import Footer from "@/components/Footer";
import DemoSection from "@/components/DemoSection";
import DemoAnalysisDisplay from "@/components/DemoAnalysisDisplay";
import { supabase } from "@/lib/supabase";
import Dashboard from "@/pages/Dashboard";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Session } from "@supabase/supabase-js";

interface DemoDataset {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  recordCount: string
  category: string
}

export default function App() {
  const [selectedDemoDataset, setSelectedDemoDataset] = useState<DemoDataset | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session)
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSelectDataset = (dataset: DemoDataset) => {
    setSelectedDemoDataset(dataset)
  }

  const handleBackToDatasets = () => {
    setSelectedDemoDataset(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Toaster />
        <div className="min-h-screen bg-background">
          <Header session={session} />
          <Routes>
            <Route path="/" element={
              <>
                <main className="pt-28">
                  <section id="hero">
                    <Hero />
                  </section>
                  <DemoSection onSelectDataset={handleSelectDataset} />
                  <section id="try-app" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      {selectedDemoDataset ? (
                        <DemoAnalysisDisplay
                          dataset={selectedDemoDataset}
                          onBack={handleBackToDatasets}
                        />
                      ) : (
                        <>
                          <div className="text-center mb-12">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold mb-6">
                              🚀 Try Our Analytics Platform Live
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                              Upload Your Own Data
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                              Upload your CSV data below and see how our revolutionary AI delivers comprehensive insights and visualizations.
                            </p>
                          </div>
                          {session ? (
                            <AnalysisApp session={session} />
                          ) : (
                            <div className="text-center">
                              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                                Please log in to access the full analytics platform.
                              </p>
                              <Button onClick={() => window.location.href = '/login'}>
                                Log In
                              </Button>
                            </div>
                          )}
                        </>
                      )}
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
            <Route path="/login" element={<Login />} />
            <Route 
              path="/analysis" 
              element={
                session ? (
                  <AnalysisApp session={session} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
