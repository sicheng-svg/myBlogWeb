import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Toaster } from '@/components/ui/sonner';
import { Home } from './pages/Home';
import { AllBlogPosts } from './pages/AllBlogPosts';
import { BlogDetail } from './pages/BlogDetail';
import { About } from './pages/About';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPostsList } from './pages/admin/AdminPostsList';
import { AdminPostEditor } from './pages/admin/AdminPostEditor';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminTags } from './pages/admin/AdminTags';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAbout } from './pages/admin/AdminAbout';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster />
      <Routes>
        {/* 公共路由 */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/blogs" element={<PublicLayout><AllBlogPosts /></PublicLayout>} />
        <Route path="/blogs/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />

        {/* 管理后台登录 */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 管理后台（受保护） */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPostsList />} />
          <Route path="posts/new" element={<AdminPostEditor />} />
          <Route path="posts/:id/edit" element={<AdminPostEditor />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="tags" element={<AdminTags />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="about" element={<AdminAbout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
