import { Plane, Sparkles, Map, Compass } from "lucide-react";

const icons = { Plane, Sparkles, Map, Compass };

const defaultPrompts = [
  { text: "Plan a weekend trip to Paris", icon: "Plane" },
  { text: "Best time to visit Bali?", icon: "Sparkles" },
  { text: "Budget destinations in Europe", icon: "Map" },
  { text: "7-day itinerary for Japan", icon: "Compass" }
];

export const QuickPrompts = ({ prompts = defaultPrompts, onSelect }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 mt-2">
    {prompts.map((prompt, index) => {
      const Icon = icons[prompt.icon] || Map;
      return (
        <button
          key={index}
          onClick={() => onSelect(prompt.text)}
          className="group relative flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/90 dark:hover:bg-gray-800/90 backdrop-blur-lg border border-white/60 dark:border-gray-700/50 hover:border-violet-400 dark:hover:border-violet-600 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/60 dark:to-fuchsia-900/60 text-violet-600 dark:text-fuchsia-300 shadow-sm transform group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight z-10 w-full px-1">
            {prompt.text}
          </span>
        </button>
      );
    })}
  </div>
);