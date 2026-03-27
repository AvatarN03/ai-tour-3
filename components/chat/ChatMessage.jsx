
import { Bot, User } from "lucide-react";

export const ChatMessage = ({ type, content, timestamp }) => {
  const isAi = type === "ai";

  return (
    <div className={`flex w-full mb-6 ${isAi ? "justify-start" : "justify-end"}`}>
      <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isAi ? "flex-row" : "flex-row-reverse"}`}>

        {/* Avatar */}
        <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-1 shadow-sm
          ${isAi ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white" : "bg-white text-violet-600 border border-violet-100"}`}
        >
          {isAi ? <Bot /> : <User />}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col">
          <div className={`px-4 py-2.5 rounded-[24px] shadow-sm
            ${isAi
              ? "bg-white/90 backdrop-blur-sm text-gray-800 border border-white/60 rounded-tl-sm font-medium"
              : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-tr-sm"
            }`}>
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
          </div>

          <span className={`text-[11px] text-gray-500 mt-1.5 px-2 font-medium ${isAi ? "text-left" : "text-right"}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

      </div>
    </div>
  );
};