export const calculateGoal = (num: number, amount: number) =>
  Math.floor(num / amount) * amount + amount;
export const calculateProgress = (count: number) =>
  ((100000 - (calculateGoal(count, 100000) - count)) / 100000) * 100;
