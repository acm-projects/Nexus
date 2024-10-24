import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './pages/Hero';
import Features from './components/Features';
import WhiteSection from './components/WhiteSection';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadDoc from './pages/UploadDoc';
import CoursesPage from './pages/CoursesPage';
import GradeCalculator from './pages/GradeCalculator';
import Footer from './components/Footer';
import SectionChat from './pages/SectionChat'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-nexus-blue-900">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <WhiteSection />
              <Features />
              {/* temp footer doc preview
              <Footer />
              */}
            </main>
          } />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/grade-calculator" element={<GradeCalculator />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/upload" element={<UploadDoc />} />
          <Route path="/section-chat/:roomId" element={<SectionChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;