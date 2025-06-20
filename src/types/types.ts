
export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  createdAt: Date;
}

export interface Occurrence {
  id: string;
  habitId: string;
  timezone: string;
  occurrenceTimestamp: number; // Unix timestamp in milliseconds
}

export type Frequency = 'daily' | 'weekly';