"use client";
import Header from "@/components/custom/Header";
import Sidebar from "@/components/custom/Sidebar";
import { useAuth } from "@/context/useAuth";
import { WeatherProvider } from "@/context/useWeather";
import { Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { Suspense, useState, useEffect } from "react";

const layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (user === null) {
      // Redirect to auth page with current path as continueTo
      router.push(`/auth?continueTo=${encodeURIComponent(pathname)}`);
    }
  }, [user, router, pathname]);

  if (user) {
    return (
      <>
        <WeatherProvider>
          <div className="p-2 bg-slate-200 dark:bg-card rounded-md">
            <div className="flex gap-2 ">
              <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
              <div
                className={`flex-1 bg-background rounded-xl md:p-2 ${
                  sidebarOpen ? "md:ml-64" : " "
                } transition-all duration-300 ease-in-out flex flex-col`}
              >
                <Header
                  toggleSidebar={toggleSidebar}
                  isSidebarOpen={sidebarOpen}
                />
                <div className=" md:px-2 md:py-4 w-full max-w-5xl mx-auto">
                  <Suspense
                    fallback={
                      <>
                        <div className="h-screen flex justify-center items-center flex-col w-full">
                          <Loader2 className="animate-spin mr-2" />
                          <div className="text-3xl text-white">Loading...</div>
                        </div>
                      </>
                    }
                  >
                    {children}
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </WeatherProvider>
      </>
    );
  }

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-violet-900/20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting to login...
        </p>
      </div>
    </div>
  );
};

export default layout;
