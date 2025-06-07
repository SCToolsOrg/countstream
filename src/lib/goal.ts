function calculateMilestoneIncrement(num: number) {
  if (!num || num === 0 || isNaN(num)) {
    return 0;
  }
  const orderOfMagnitude = Math.floor(Math.log10(num));
  let milestoneIncrement: number;

  if (orderOfMagnitude < 2) {
    milestoneIncrement = 10;
  } else if (orderOfMagnitude >= 2 && orderOfMagnitude < 5) {
    milestoneIncrement = Math.pow(10, orderOfMagnitude - 1);
  } else {
    milestoneIncrement = Math.pow(10, orderOfMagnitude - 2);
  }

  return milestoneIncrement;
}

export function calculateMilestones(num: number) {
  const milestoneIncrement = calculateMilestoneIncrement(num);
  const currentMilestone = num - (num % milestoneIncrement);
  const nextMilestone =
    Math.ceil(num / milestoneIncrement) * milestoneIncrement;
  return { currentMilestone, nextMilestone };
}

export function calculateGoal(num: number) {
  const { nextMilestone } = calculateMilestones(num);
  return nextMilestone - num;
}

export function calculateProgress(num: number) {
  const milestoneIncrement = calculateMilestoneIncrement(num);
  return ((num % milestoneIncrement) / milestoneIncrement) * 100;
}
