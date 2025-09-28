export interface GestationalAge {
  weeks: number;
  days: number;
  totalDays: number;
}

export function calculateGestationalAge(expectedDeliveryDate: string | Date): GestationalAge {
  const edd = new Date(expectedDeliveryDate);
  const today = new Date();

  const totalPregnancyDays = 280; // 40 weeks
  const daysRemaining = Math.floor((edd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const currentDays = totalPregnancyDays - daysRemaining;

  const weeks = Math.floor(currentDays / 7);
  const days = currentDays % 7;

  return {
    weeks: Math.max(0, weeks),
    days: Math.max(0, days),
    totalDays: Math.max(0, currentDays)
  };
}

export function calculateEDDFromLMP(lastMenstrualPeriod: string | Date): Date {
  const lmp = new Date(lastMenstrualPeriod);
  const edd = new Date(lmp);
  edd.setDate(edd.getDate() + 280); // Add 280 days (40 weeks)
  return edd;
}

export function formatGestationalAge(age: GestationalAge): string {
  return `${age.weeks} weeks, ${age.days} days`;
}