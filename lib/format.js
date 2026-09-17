export function formatINR(value, decimals = 2) {
  const num = Number(value) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
