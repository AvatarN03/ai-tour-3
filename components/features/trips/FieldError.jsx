export const FieldError = ({ msg }) =>
  msg ? (
    <p className="text-red-500 text-sm mt-1 flex items-center">
      <span className="mr-1">⚠️</span>
      {msg}
    </p>
  ) : null;