import { motion } from "framer-motion";

export const TypingIndicator = () => (
  <div className="flex gap-1 px-4 py-2 bg-secondary w-fit rounded-2xl">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
        className="w-1.5 h-1.5 bg-foreground/50 rounded-full"
      />
    ))}
  </div>
);