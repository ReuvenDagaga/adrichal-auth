import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Providers } from './lib/providers';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminUnauthorized from './pages/admin/Unauthorized';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMediaLibrary from './pages/admin/MediaLibrary';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import SuperAdminTenants from './pages/super-admin/Tenants';
import SuperAdminTenantForm from './pages/super-admin/TenantForm';
import SuperAdminUsers from './pages/super-admin/Users';
import SuperAdminSettings from './pages/super-admin/Settings';

// Route Guards
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SuperAdminRoute } from './components/auth/SuperAdminRoute';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Cursor from './components/ui/Cursor';
import WhatsAppButton from './components/ui/WhatsAppButton';
import PageTransition from './components/ui/PageTransition';

// Hooks
import { useSmoothScroll } from './hooks/useSmoothScroll';

function AppContent() {
  const location = useLocation();
  useSmoothScroll();

  // Check if we're in admin routes
  const isAdminRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/super-admin');

  // Super Admin routes
  if (location.pathname.startsWith('/super-admin')) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route
          path="/super-admin"
          element={
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/super-admin/tenants"
          element={
            <SuperAdminRoute>
              <SuperAdminTenants />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/super-admin/tenants/new"
          element={
            <SuperAdminRoute>
              <SuperAdminTenantForm />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/super-admin/tenants/:id/edit"
          element={
            <SuperAdminRoute>
              <SuperAdminTenantForm />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/super-admin/users"
          element={
            <SuperAdminRoute>
              <SuperAdminUsers />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/super-admin/settings"
          element={
            <SuperAdminRoute>
              <SuperAdminSettings />
            </SuperAdminRoute>
          }
        />
      </Routes>
    );
  }

  // Admin routes
  if (location.pathname.startsWith('/admin')) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/unauthorized" element={<AdminUnauthorized />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/media"
          element={
            <ProtectedRoute>
              <AdminMediaLibrary />
            </ProtectedRoute>
          }
        />
      </Routes>
    );
  }

  // Public routes with full design
  return (
    <>
      <Cursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="/projects"
            element={
              <PageTransition>
                <Projects />
              </PageTransition>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PageTransition>
                <ProjectDetail />
              </PageTransition>
            }
          />
          <Route
            path="/blog"
            element={
              <PageTransition>
                <Blog />
              </PageTransition>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <PageTransition>
                <BlogPost />
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <Contact />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <AppContent />
      </Providers>
    </BrowserRouter>
  );
}

export default App;
