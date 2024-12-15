export const formatDate = (dateString: string): string => {
  const originalDate = new Date(dateString);

  const day = originalDate.getUTCDate().toString().padStart(2, "0");
  const month = (originalDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = originalDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

// Example Aug 2024 - Sep 2025 or Aug 2024 to Present
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startMonth = start.toLocaleString("default", { month: "short" });
  const startYear = start.getFullYear();
  const endMonth = end.toLocaleString("default", { month: "short" });
  const endYear = end.getFullYear();

  if (endYear === new Date().getFullYear() && endMonth === new Date().toLocaleString("default", { month: "short" })) {
    return `${startMonth} ${startYear} - Present`;
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};

export const calculateDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const startDay = start.getDate();
  const endYear = end.getFullYear();
  const endMonth = end.getMonth();
  const endDay = end.getDate();

  let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

  if (endDay >= startDay) {
    totalMonths++;
  }

  if (totalMonths === 1) {
    return "1 month";
  }

  if (totalMonths < 12) {
    return `${totalMonths} months`;
  }

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }

  return `${years} ${years === 1 ? "year" : "years"}, ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
};
