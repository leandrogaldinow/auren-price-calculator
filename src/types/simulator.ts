export interface SimulatorInputs {
  /** Daily ad budget. */
  dailyInvestment: number;
  cpa: number;
  days: number;
}

export interface SimulatorResults {
  totalInvestment: number;
  orders: number;
  revenue: number;
  profit: number;
  roi: number;
  roas: number;
  ordersPerDay: number;
}
