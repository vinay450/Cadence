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
import Profile from "@/pages/Profile";

interface DemoDataset {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  recordCount: React.ReactNode
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
                  {selectedDemoDataset && (
                    <section id="demo-section" className="py-20">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <DemoAnalysisDisplay
                          dataset={selectedDemoDataset}
                          onBack={handleBackToDatasets}
                        />
                      </div>
                    </section>
                  )}
                  <TechnicalFeatures />
                  <ComparisonSection />
                </main>
                <Footer />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analysis" element={<AnalysisApp session={session} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
