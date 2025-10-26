"use client";
import {
  PanelLeftClose,
  PanelRightClose,
  ChevronRight,
  Sparkles,
  Bell,
  Search,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import LanguageSelector from "./LanguageSelector";
import PageSearch from "./PageSearch";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const pathname = usePathname();
  const [showPageSearch, setShowPageSearch] = useState(false);

  // Generate breadcrumb from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];
    let currentPath = "";
    
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: index === paths.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Keyboard shortcut for Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowPageSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-30 bg-gray-300/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm"
      >
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* Left Section: Sidebar Toggle + Breadcrumb */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Sidebar Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer transition-colors text-gray-700 dark:text-gray-300"
            >
              <motion.div
                animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelRightClose className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>

            {/* Breadcrumb Navigation */}
            <nav className="hidden sm:flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {breadcrumbs.map((crumb, index) => (
                <motion.div
                  key={crumb.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                  {crumb.isLast ? (
                    <span className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-sm font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Right Section: Search + Actions */}
          <div className="flex items-center gap-2">
            {/* Page Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPageSearch(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              title="Search page (Ctrl+F)"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
            </motion.button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Selector Component */}
            <LanguageSelector />
          </div>
        </div>
      </motion.div>

      {/* Page Search Component (Ctrl+F style) */}
      <PageSearch 
        isOpen={showPageSearch} 
        onClose={() => setShowPageSearch(false)} 
      />
    </>
  );
};

export default Header;