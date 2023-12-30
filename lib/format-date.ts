export const formatDate = (dateString: string): string => {
  const originalDate = new Date(dateString);

  const day = originalDate.getUTCDate().toString().padStart(2, "0");
  const month = (originalDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = originalDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
};
