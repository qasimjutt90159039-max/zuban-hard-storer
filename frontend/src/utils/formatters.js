export const formatPKR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rs. 0';
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
