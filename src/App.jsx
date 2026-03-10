/**
 * App Component - Main application with routing and layout
 * Uses React Router for navigation and lazy loading for code splitting
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VehicleProvider } from './context/VehicleContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';

// Lazy-loaded pages for code splitting and performance
const HomePage = lazy(() => import('./pages/HomePage'));
const VehicleListingPage = lazy(() => import('./pages/VehicleListingPage'));
const VehicleDetailPage = lazy(() => import('./pages/VehicleDetailPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const BuyingGuidePage = lazy(() => import('./pages/BuyingGuidePage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
        <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// Scroll to top on route change
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <VehicleProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-dark-900">
          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cars" element={<VehicleListingPage type="car" />} />
                <Route path="/bikes" element={<VehicleListingPage type="bike" />} />
                <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/buying-guide" element={<BuyingGuidePage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                {/* 404 Fallback */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
                        <p className="text-gray-500 mb-6">Page not found</p>
                        <a href="/" className="btn-gradient">Go Home</a>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </main>

          {/* Footer */}
          <Footer />

          {/* AI Chatbot Widget */}
          <ChatbotWidget />
        </div>
      </Router>
    </VehicleProvider>
  );
}

export default App;
