export const FieldLabel = ({ label, required }) => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    {label} {required && <span className="text-red-500">*</span>}
  </label>
);