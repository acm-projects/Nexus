import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './pages/Hero';
import Features from './components/Features';
import WhiteSection from './components/WhiteSection';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadDoc from './pages/UploadDoc';
import DocPreview from './pages/DocPreview';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-nexus-blue-900">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <Hero />
                <WhiteSection />
                <Features />
              </main>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<UploadDoc />} />
          <Route path="/doc-preview" element={<DocPreview />} />
          {/* Temporarily route Grade Calculator to DocPreview */}
          <Route path="/grade-calculator" element={<DocPreview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;