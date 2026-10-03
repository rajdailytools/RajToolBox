import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';
import { ToastContainer } from './components/layout/ToastContainer';
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import {
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsPage,
  DisclaimerPage,
  CopyrightPage,
  AdvertisingPolicyPage,
  GuidesPage,
  NotFoundPage
} from './pages/StaticPages';
import { getToolBySlug } from './data/tools';
import { CATEGORIES } from './data/categories';
import { ToolCategory } from './types';

const MainRouter: React.FC = () => {
  const { currentPath } = useApp();

  // Normalize path by stripping trailing slashes for comparison
  const path = currentPath.replace(/\/+$/, '') || '/';

  // 1. Home
  if (path === '/') {
    return <HomePage />;
  }

  // 2. All tools
  if (path === '/tools') {
    return <AllToolsPage />;
  }

  // 3. Tool Detail Route (/tools/:slug)
  if (path.startsWith('/tools/')) {
    const slug = path.replace('/tools/', '');
    const tool = getToolBySlug(slug);
    if (tool) {
      return <ToolDetailPage tool={tool} />;
    }
    return <NotFoundPage />;
  }

  // 4. Static Pages
  if (path === '/about') return <AboutPage />;
  if (path === '/contact') return <ContactPage />;
  if (path === '/guides') return <GuidesPage />;
  if (path === '/privacy-policy') return <PrivacyPolicyPage />;
  if (path === '/terms-and-conditions') return <TermsPage />;
  if (path === '/disclaimer') return <DisclaimerPage />;
  if (path === '/copyright') return <CopyrightPage />;
  if (path === '/advertising-policy') return <AdvertisingPolicyPage />;

  // 5. Category Routes (e.g. /pdf-tools, /image-tools)
  const rawCategory = path.replace(/^\//, '');
  const matchedCategory =
    CATEGORIES[rawCategory as ToolCategory] ||
    Object.values(CATEGORIES).find(
      (c) =>
        c.slug === rawCategory ||
        c.id === rawCategory ||
        (rawCategory === 'education-math' && c.id === 'educational-tools') ||
        (rawCategory === 'qr-barcode' && c.id === 'qr-barcode-tools') ||
        (rawCategory === 'date-time' && c.id === 'date-time-tools')
    );

  if (matchedCategory) {
    return <CategoryPage category={matchedCategory} />;
  }

  // Check if someone navigated to /:category/:slug
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 2) {
    const cat =
      CATEGORIES[parts[0] as ToolCategory] ||
      Object.values(CATEGORIES).find((c) => c.slug === parts[0] || c.id === parts[0]);
    if (cat) {
      const tool = getToolBySlug(parts[1]);
      if (tool) {
        return <ToolDetailPage tool={tool} />;
      }
    }
  }

  // 6. 404 Fallback
  return <NotFoundPage />;
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-[#FFFDF7] dark:bg-[#0F0F12] text-[#18181B] dark:text-[#F4F4F5]">
        <Header />
        <main className="flex-1">
          <MainRouter />
        </main>
        <Footer />
        <SearchModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
