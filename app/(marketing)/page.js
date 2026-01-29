
import Image from "next/image";

import Navbar from "@/components/custom/Marketing/Navbar";
import Hero from "@/components/custom/Marketing/Hero";
import Features from "@/components/custom/Marketing/Features";
import HTW from "@/components/custom/Marketing/HTW";
import Pricing from "@/components/custom/Marketing/Pricing";
import AboutSection from "@/components/custom/Marketing/AboutSection";
import CTA from "@/components/custom/Marketing/CTA";

export const metadata = {
  title: "Home - AI Tour",
  description: "Plan trips smarter with AI",
};



const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-200 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HTW />
      
      {/* pricing section  */}
      <section className="pricing 9-6 min-h-screen md:h-screen w-full bg-sidebar-accent/50 py-14 px-4 overflow-hidden ">
        <div
          className="flex flex-col items-center justify-center h-full  p-2 md:p-6 text-center max-w-7xl mx-auto relative"
          id="pricing"
        >
          <div className="hidden md:block absolute bg-blue-800 blur-[125px] -top-20 -left-10 w-120 h-96 z-0" />
          <div className="hidden md:block absolute bg-indigo-700 blur-[265px] top-1/3 -translate-y-1/2 right-10 w-150 h-150 z-0 " />

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 z-20">
            💸 Pricing Plans
          </h2>
          <p className="text-base tracking-widest text-gray-700 dark:text-gray-300 z-20">
            Simple pricing for smarter trips — free to start, powerful when you
            upgrade.
          </p>

          <div className="flex gap-12 justify-center items-center flex-1 mt-6 w-full z-20 relative">
            <div className="hidden lg:block w-1/3">
              <Image
                src="/pricing.png"
                alt="pricing plans"
                width={800}
                height={800}
                className="xl:w-full h-full "
              />
            </div>
            <div className="flex gap-12 w-full lg:w-2/3 justify-center items-center ">
              <Pricing />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
     <CTA />

      {/* about section  */}
      <section
        id="about"
        className="px-4 md:px-10 py-4 w-full relative overflow-hidden"
      >
        <div className="bg-slate-600 w-3xl h-14 rounded-full rotate-45 absolute top-1/2 -left-24 md:left-12 z-0" />
        <div className="bg-slate-600 w-3xl h-14 rounded-full rotate-45 absolute top-1/2 translate-y-36 -left-24 md:left-12 z-0" />
        <div className="relative z-20">
          <AboutSection />
        </div>
      </section>

      <footer className="w-full text-xl text-center bg-gray-900 px-10 pt-6 pb-3 flex items-center justify-center ">
        <small className="text-gray-300 tracking-widest">
          &copy;{" "}
          <span className="gradient-text ">{new Date().getFullYear()}</span> AI
          Tour. All rights reserved.
        </small>
      </footer>
    </div>
  );
};

export default LandingPage;
