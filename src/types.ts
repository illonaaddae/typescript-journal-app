export enum Mood {
  HAPPY = "HAPPY",
  SAD = "SAD",
  MOTIVATED = "MOTIVATED",
  STRESSED = "STRESSED",
  CALM = "CALM",
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  timestamp: number;
}

// The type alais for an array of journal entries
export type Journal = JournalEntry[];

// Helper type for creating new entries (auto-generates id and timestamp)

export type NewJournalEntry = Omit<JournalEntry, "id" | "timestamp">;

export function findByProperty<T>(
  list: T[],
  key: keyof T,
  value: T[keyof T]
): T | undefined {
  return list.find((item) => item[key] === value);
}
