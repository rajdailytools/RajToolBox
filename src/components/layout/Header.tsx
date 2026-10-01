import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_LIST } from '../../data/categories';
import { IconRenderer } from '../common/IconRenderer';
import { RajToolBoxLogo } from '../RajToolBoxLogo';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Wrench,
  Bookmark,
  Layers,
  BookOpen,
  Info,
  Mail,
  ShieldCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode, setSearchModalOpen, currentPath, navigate } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body & html scroll when mobile menu is open, restore after closing
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setDesktopCategoriesOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7]/95 dark:bg-[#0F0F12]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 w-full min-w-0">
          {/* Zone 1: Logo */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => handleNav('/')}
              className="flex items-center text-left group focus:outline-none focus:ring-2 focus:ring-[#EC4899] rounded-lg p-0.5 shrink-0"
              aria-label="RajToolBox Home"
            >
              <RajToolBoxLogo className="h-7 sm:h-8 md:h-9 w-auto shrink-0" />
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => handleNav('/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/'
                  ? 'text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                  : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => handleNav('/tools/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/tools/'
                  ? 'text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                  : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              All Tools
            </button>

            {/* Core Categories in Top Bar */}
            <button
              type="button"
              onClick={() => handleNav('/pdf-tools/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPath.startsWith('/pdf-tools')
                  ? 'text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                  : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              PDF
            </button>

            <button
              type="button"
              onClick={() => handleNav('/image-tools/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPath.startsWith('/image-tools')
                  ? 'text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                  : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              Images
            </button>

            <button
              type="button"
              onClick={() => handleNav('/text-tools/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPath.startsWith('/text-tools')
                  ? 'text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                  : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              Text
            </button>

            <button
              type="button"
              onClick={() => handleNav('/developer-tools/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPath.startsWith('/developer-tools')
                  ? 'text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                  : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              Developers
            </button>

            <button
              type="button"
              onClick={() => handleNav('/qr-barcode-tools/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPath.startsWith('/qr-barcode-tools')
                  ? 'text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                  : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              QR & Barcode
            </button>

            <button
              type="button"
              onClick={() => handleNav('/converters/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPath.startsWith('/converters')
                  ? 'text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                  : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              Converters
            </button>

            {/* More Categories Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDesktopCategoriesOpen((prev) => !prev)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <span>More</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {desktopCategoriesOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setDesktopCategoriesOpen(false)}
                >
                  <div className="text-xs font-bold text-[#71717A] px-2 py-1 uppercase tracking-wider">
                    All Tool Categories
                  </div>
                  {CATEGORIES_LIST.slice(6).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleNav(`/${cat.slug}/`)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs font-medium text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20 transition-colors"
                    >
                      <IconRenderer name={cat.iconName} className="w-4 h-4 text-[#EC4899]" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-[#E4E4E7] dark:border-[#27272A] my-1" />
                  <button
                    type="button"
                    onClick={() => handleNav('/guides/')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs font-medium text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
                  >
                    <span>Guides & Tutorials</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('/about/')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs font-medium text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
                  >
                    <span>About RajToolBox</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNav('/guides/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/guides/' || currentPath === '/guides'
                  ? 'text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                  : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              Guides
            </button>

            <button
              type="button"
              onClick={() => handleNav('/about/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/about/' || currentPath === '/about'
                  ? 'text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                  : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              About
            </button>
          </nav>

          {/* Zone 3: Right Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] text-[#71717A] dark:text-[#A1A1AA] text-xs font-medium shadow-xs group transition-all min-h-[38px]"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4 text-[#EC4899] shrink-0" />
              <span className="hidden md:inline">Search tools...</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#F4F4F5] dark:bg-[#27272A] text-[#71717A] dark:text-[#A1A1AA] rounded border border-[#E4E4E7] dark:border-[#3F3F46]">
                Ctrl K
              </kbd>
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] hover:border-[#EC4899] transition-all shrink-0"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#FACC15]" /> : <Moon className="w-4 h-4 text-[#EC4899]" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] hover:border-[#EC4899] transition-all shrink-0"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* PORTAL-BASED MOBILE DRAWER: Renders directly into document.body to avoid header backdrop-filter containing block clipping */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[9999] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Drawer">
          {/* Backdrop covering entire viewport */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container: 100dvh, unclipped by any parent, independent scroll */}
          <div
            className="fixed inset-y-0 right-0 w-[290px] max-w-[85vw] sm:max-w-xs bg-[#FFFDF7] dark:bg-[#141418] border-l border-[#E4E4E7] dark:border-[#27272A] shadow-2xl flex flex-col z-[10000] h-screen h-[100dvh] max-h-[100dvh] overflow-hidden animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header (shrink-0) */}
            <div className="flex items-center justify-between p-4 border-b border-[#E4E4E7] dark:border-[#27272A] shrink-0 bg-[#FFFDF7] dark:bg-[#141418]">
              <div className="flex items-center shrink-0">
                <RajToolBoxLogo className="h-7 w-auto shrink-0" />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:text-[#18181B] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202026] transition-colors"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search inside Drawer (shrink-0) */}
            <div className="p-3 border-b border-[#E4E4E7] dark:border-[#27272A] shrink-0 bg-white/40 dark:bg-[#18181B]/40">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs text-[#71717A]"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#EC4899]" />
                  <span>Search all tools...</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FCE7F3] dark:bg-[#EC4899]/30 text-[#EC4899] font-bold">
                  GO
                </span>
              </button>
            </div>

            {/* Drawer Scrollable Body: overflow-y: auto with smooth momentum */}
            <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto overscroll-contain">
              {/* 1. Home */}
              <button
                type="button"
                onClick={() => handleNav('/')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  currentPath === '/'
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                    : 'text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                }`}
              >
                <Wrench className="w-4 h-4 text-[#EC4899] shrink-0" />
                <span>Home</span>
              </button>

              {/* 2. Tools / All Tools */}
              <button
                type="button"
                onClick={() => handleNav('/tools/')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  currentPath.startsWith('/tools')
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                    : 'text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-[#EC4899] shrink-0" />
                  <span>Tools</span>
                </div>
                <span className="text-[11px] font-bold text-[#EC4899]">
                  Explore &rarr;
                </span>
              </button>

              {/* 3. Expandable Categories (All categories visible & scrollable) */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24] transition-colors"
                >
                  <span className="text-xs uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] font-bold">
                    Categories ({CATEGORIES_LIST.length})
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#71717A] transition-transform duration-200 ${
                      mobileCategoriesOpen ? 'rotate-180 text-[#EC4899]' : ''
                    }`}
                  />
                </button>

                {mobileCategoriesOpen && (
                  <div className="mt-1 space-y-0.5 pl-2 border-l-2 border-[#EC4899]/40 ml-4 animate-in fade-in duration-150">
                    {CATEGORIES_LIST.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleNav(`/${cat.slug}/`)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                          currentPath.includes(cat.slug)
                            ? 'text-[#EC4899] font-bold bg-[#FCE7F3] dark:bg-[#EC4899]/20'
                            : 'text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20'
                        }`}
                      >
                        <IconRenderer name={cat.iconName} className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
                        <span className="truncate">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Guides */}
              <button
                type="button"
                onClick={() => handleNav('/guides/')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  currentPath.startsWith('/guides')
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                    : 'text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#EC4899] shrink-0" />
                <span>Guides</span>
              </button>

              {/* 5. About */}
              <button
                type="button"
                onClick={() => handleNav('/about/')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  currentPath.startsWith('/about')
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                    : 'text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                }`}
              >
                <Info className="w-4 h-4 text-[#EC4899] shrink-0" />
                <span>About</span>
              </button>

              {/* 6. Contact */}
              <button
                type="button"
                onClick={() => handleNav('/contact/')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  currentPath.startsWith('/contact')
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                    : 'text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                }`}
              >
                <Mail className="w-4 h-4 text-[#EC4899] shrink-0" />
                <span>Contact & Support</span>
              </button>

              {/* Popular Direct Links */}
              <div className="pt-3 border-t border-[#E4E4E7] dark:border-[#27272A] space-y-0.5">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                  Popular Collections
                </div>
                <button
                  type="button"
                  onClick={() => handleNav('/pdf-tools/')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
                >
                  <IconRenderer name="FileText" className="w-4 h-4 text-[#EC4899] shrink-0" />
                  <span>PDF Tools</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/image-tools/')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
                >
                  <IconRenderer name="Image" className="w-4 h-4 text-[#EC4899] shrink-0" />
                  <span>Image Tools</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/text-tools/')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
                >
                  <IconRenderer name="Type" className="w-4 h-4 text-[#EC4899] shrink-0" />
                  <span>Text Tools</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/developer-tools/')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
                >
                  <IconRenderer name="Code" className="w-4 h-4 text-[#EC4899] shrink-0" />
                  <span>Developer Tools</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/converters/')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#18181B] dark:text-[#F4F4F5] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
                >
                  <IconRenderer name="ArrowRightLeft" className="w-4 h-4 text-[#EC4899] shrink-0" />
                  <span>Converters</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer (shrink-0) with Theme toggle & privacy trust marker */}
            <div className="p-3 border-t border-[#E4E4E7] dark:border-[#27272A] bg-white/70 dark:bg-[#18181B]/70 shrink-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#71717A]">Theme</span>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-medium"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-[#FACC15]" /> : <Moon className="w-4 h-4 text-[#EC4899]" />}
                  <span>{isDarkMode ? 'Light' : 'Dark'}</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#16A34A] dark:text-[#4ADE80] font-medium pt-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>100% In-Browser & Private</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

