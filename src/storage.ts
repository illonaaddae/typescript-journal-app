import { json } from "stream/consumers";
import { JournalEntry, Journal } from "./types";

const STORAGE_KEY = "journal_entries";

export function loadEntries(): Journal {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    // location.getItem returns a string or null
    if (data === null) return [];

    //  Parse and assert type
    const parsed = JSON.parse(data);

    // Type guard: check if parsed is an array of JournalEntry
    if (!Array.isArray(parsed)) {
      console.error("Stored data is not an array of journal entries");
      return [];
    }

    // Type assertion : we trust is a JournalEntry array
    return parsed as Journal;

    //
  } catch (error) {
    console.error("Failed to load journal entries", error);
    return [];
  }
}

export function saveEntries(entries: Journal): void {
    try {
        const serialized = JSON.stringify(entries);
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
        console.error("Failed to save journal entries", error);
    }
}