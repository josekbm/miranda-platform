export interface WeeklyPoint {
  label: string;
  revenueCents: number;
  occupancyPct: number;
}

export interface OverviewStats {
  arrivalsToday: number;
  departuresToday: number;
  occupancyPct: number;
  revenueMonthCents: number;
  pendingContacts: number;
  totalBookings: number;
  weekly: WeeklyPoint[];
}
