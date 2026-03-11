export const renderContent = (content) => {
  if (!content) return ''
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>'
    )
    .replace(/\n/g, '<br/>')
}

export const formatDate = (dateObj) => {
  if (!dateObj) return "Unknown date";

  const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
  const now = new Date();

  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const sameYear = date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (sameYear) {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }

  return date.getFullYear().toString();
};