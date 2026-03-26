// components/custom/PrintHeader.jsx

import Logo from "@/components/custom/Logo";

const PrintHeader = ({ tripName }) => {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="hidden print:flex items-center justify-between w-full border-b-2 border-gray-300 dark:border-gray-600 pb-3 mb-6">
      
      {/* Left — Date */}
      <div className="text-sm text-gray-600 w-1/3">
        {today}
      </div>

      {/* Center — Logo + Project Name */}
      {/* <div className="flex flex-col items-center gap-1 w-1/3">
        <img
          src="/logo.png"           // your logo path in /public
          alt="Logo"
          className="h-8 w-auto object-contain"
        />
        <span className="text-sm font-bold text-gray-800 dark:text-white tracking-wide">
          AI Tour
        </span>
      </div> */}
      <Logo />

      {/* Right — Trip Name */}
      <div className="text-md text-gray-800 w-1/3 text-right truncate">
        {tripName}
      </div>

    </div>
  );
};

export default PrintHeader;