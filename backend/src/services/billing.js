export const START_BALANCE_CENTS = 20000; 
export const COST_PER_MINUTE_CENTS = 40;  
export const MIN_COST_PER_CALL_CENTS = 40; 

export function calculateCostCents(billedSeconds) {
  const minutes = billedSeconds / 60;
  const cost = Math.ceil(minutes * 1000) / 1000 * COST_PER_MINUTE_CENTS; 
  const rounded = Math.round(minutes * COST_PER_MINUTE_CENTS);
  return Math.max(rounded, MIN_COST_PER_CALL_CENTS);
}
