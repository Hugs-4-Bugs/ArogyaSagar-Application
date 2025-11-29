
import React, { useEffect } from 'react';
import * as RRD from 'react-router-dom';
import { Navbar, Footer, CartSidebar } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Consultation } from './pages/Consultation';
import { Therapies } from './pages/Therapies';
import { Admin } from './pages/Admin';
import { Wellness } from './pages/Wellness';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ProductDetail } from './pages/ProductDetail';
import { VideoCall } from './pages/VideoCall';
import { Wishlist } from './pages/Wishlist';
import { UserProfile } from './pages/UserProfile';
import { AppProvider } from './context/AppContext';
import { ChatBot } from './components/ChatBot';
import Lenis from 'lenis';

const { HashRouter: Router, Routes, Route, useLocation } = RRD as any;

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Smooth Scrolling
const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  return <>{children}</>;
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <SmoothScroll>
          <div className="flex flex-col min-h-screen font-sans text-gray-900">
            <ScrollToTop />
            <Routes>
               {/* Routes with Layout */}
               <Route path="/" element={<><Navbar /><CartSidebar /><main className="flex-grow"><Home /></main><Footer /><ChatBot /></>} />
               <Route path="/shop" element={<><Navbar /><CartSidebar /><main className="flex-grow"><Shop /></main><Footer /><ChatBot /></>} />
               <Route path="/product/:id" element={<><Navbar /><CartSidebar /><main className="flex-grow"><ProductDetail /></main><Footer /><ChatBot /></>} />
               <Route path="/consult" element={<><Navbar /><CartSidebar /><main className="flex-grow"><Consultation /></main><Footer /><ChatBot /></>} />
               <Route path="/therapies" element={<><Navbar /><CartSidebar /><main className="flex-grow"><Therapies /></main><Footer /><ChatBot /></>} />
               <Route path="/wellness" element={<><Navbar /><CartSidebar /><main className="flex-grow"><Wellness /></main><Footer /><ChatBot /></>} />
               
               {/* Role Based Routes */}
               <Route path="/admin" element={<><Navbar /><CartSidebar /><main className="flex-grow"><Admin /></main><Footer /><ChatBot /></>} />
               <Route path="/profile" element={<><Navbar /><CartSidebar /><main className="flex-grow"><UserProfile /></main><Footer /><ChatBot /></>} />
               
               {/* Auth Routes */}
               <Route path="/login" element={<><Navbar /><CartSidebar /><main className="flex-grow"><Login /></main><Footer /><ChatBot /></>} />
               <Route path="/signup" element={<><Navbar /><CartSidebar /><main className="flex-grow"><Signup /></main><Footer /><ChatBot /></>} />
               <Route path="/forgot-password" element={<><Navbar /><CartSidebar /><main className="flex-grow"><ForgotPassword /></main><Footer /><ChatBot /></>} />
               <Route path="/reset-password" element={<><Navbar /><CartSidebar /><main className="flex-grow"><ResetPassword /></main><Footer /><ChatBot /></>} />
               <Route path="/wishlist" element={<><Navbar /><CartSidebar /><main className="flex-grow"><Wishlist /></main><Footer /><ChatBot /></>} />
               
               {/* Standalone */}
               <Route path="/video-call" element={<VideoCall />} />
            </Routes>
          </div>
        </SmoothScroll>
      </Router>
    </AppProvider>
  );
};

export default App;
