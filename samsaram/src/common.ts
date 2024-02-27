export function calculatePercentage(num: number, den: number) {
  let percentage = Math.round((num / den) * 100);
  return percentage > 100 ? 100 : percentage;
}

export function formatNumber(num: number) {
  return num.toLocaleString('en-IN');
}

export function setProgressBarColour(num: number, den: number) {
  let percentage = calculatePercentage(num, den);
  if (percentage < 70) {
    return 'to-green-400';
  }
  if (percentage > 70 && percentage < 90) {
    return 'to-yellow-400';
  }
  return 'to-red-400';
}