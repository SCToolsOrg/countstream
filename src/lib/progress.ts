export function calculateProgress(num: number) {
  if (num < 0) {
    throw new Error("Input number must be non-negative.");
  }
  if (num === 0) {
    return 0; // Or some other sensible default, depending on desired behavior
  }

  // Determine the order of magnitude for the current number
  const orderOfMagnitude = Math.floor(Math.log10(num));

  let milestoneIncrement: number;

  if (orderOfMagnitude < 2) {
    // For numbers less than 100 (e.g., 10 -> 20, 50 -> 60)
    milestoneIncrement = 10;
  } else if (orderOfMagnitude >= 2 && orderOfMagnitude < 5) {
    // For numbers between 100 and 99,999 (e.g., 100 -> 110, 10,000 -> 11,000)
    milestoneIncrement = Math.pow(10, orderOfMagnitude - 1);
  } else {
    // For numbers 100,000 and above
    // The pattern is 10% of the number's order of magnitude
    milestoneIncrement = Math.pow(10, orderOfMagnitude - 2);
  }

  // Calculate the percentage
  const percentage = ((num % milestoneIncrement) / milestoneIncrement) * 100;

  return percentage;
}
