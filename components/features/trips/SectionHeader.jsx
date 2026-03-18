export const SectionHeader = ({ icon, color, title, subtitle }) => (
  <div className="flex items-center mb-3">
    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mr-3`}>
      <span className="text-white text-xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  </div>
);