export const times = [
  ["30s", 30],
  ["1m", 60],
  ["10m", 600],
  ["1h", 3600],
  ["6h", 21600],
  ["12h", 43200],
  ["24h", 86400],
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCombn(arr: any[]) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (isNaN(arr[i])) {
      arr.splice(i, 1);
    }
  }
  for (let i = 0; i < arr.length; i++) {
    //console.log(i)
    if (i == 0) {
      count = count + (arr[i] - parseFloat(arr[i]));
    } else {
      count = count + (parseFloat(arr[i]) - parseFloat(arr[i - 1]));
    }
  }
  return count;
}

export function calculateGain(history: number[], time: (typeof times)[number]) {
  return getCombn(history.slice(-Math.round(time[1] / 2)));
}

export function calculateAverage(
  history: number[],
  time: (typeof times)[number]
) {
  const average =
    getCombn(history) / history.length / Math.floor(parseFloat("2000") / 1000);

  const avg = Math.floor(average * time[1]);
  return isNaN(avg) ? 0 : avg;
}
