import Image from "next/image";

import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-start  justify-center bg-gradient-to-br    from-neutral-700 via-neutral-800 to-neutral-950 transition-colors">
      <div className="flex flex-col items-center gap-6 p-8 pt-32 space-y-6">
        <div className="flex items-end gap-2">

          <Image
            src="/logo.png"
            alt="logo"
            width={80}
            height={80}
            className="animate-pulse"
          />
          <h3 className="text-4xl font-bold text-gray-300">AI Tour</h3>
        </div>


        {/* Loading text with subtle animation */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold  text-neutral-100 tracking-tight">
            Loading Your Experience
          </h2>
          <p className="text-sm text-neutral-400 max-w-xs">
            Preparing everything for you. This will only take a moment.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r  from-blue-400 to-blue-500 animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style jsx>{`
      @keyframes loading {
        0%, 100% {
          transform: translateX(-100%);
        }
        50% {
          transform: translateX(100%);
        }
      }
    `}</style>
    </div>

  );
};



export default Loading;

export const ViewTripLoading = () => {
  return (
    <div className="min-h-[90vh] flex items-center justify-center ">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-indigo-500/20 dark:bg-indigo-400/10 rounded-full animate-pulse"></div>
          <Loader2
            className="relative animate-spin text-indigo-600 dark:text-indigo-400"
            size={48}
            strokeWidth={2.5}
          />
        </div>
        <span className="text-xl font-semibold dark:text-white text-gray-800">
          Loading Trip Details...
        </span>
      </div>
    </div>
  );
};

export const GenPlanLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-semibold text-gray-700">
          Generating your perfect trip...
        </p>
      </div>
    </div>
  );
};
