import { JournalEntry, Journal, Mood, NewJournalEntry } from "./types.js";
import { loadEntries, saveEntries } from "./storage.js";
import {
  renderEntries,
  showNotification,
  getFormData,
  resetForm,
} from "./ui.js";

/**
 * Main Journal Application Logic
 */

// Application state
let entries: Journal = [];
let currentFilter: Mood | "all" = "all";
let searchQuery: string = "";

/**
 * Generate a unique ID for new entries
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add a new journal entry
 */
function addEntry(newEntry: NewJournalEntry): void {
  const entry: JournalEntry = {
    id: generateId(),
    timestamp: Date.now(),
    ...newEntry,
  };

  entries.push(entry);
  saveEntries(entries);
  applyFiltersAndRender();
  showNotification("Entry saved successfully! 🎉", "success");
}

/**
 * Delete an entry by ID
 */
function deleteEntry(id: string): void {
  const index = entries.findIndex((entry) => entry.id === id);
  if (index === -1) {
    showNotification("Entry not found", "error");
    return;
  }

  if (confirm("Are you sure you want to delete this entry?")) {
    entries.splice(index, 1);
    saveEntries(entries);
    applyFiltersAndRender();
    showNotification("Entry deleted", "success");
  }
}

/**
 * Edit an entry (for now, we'll implement a simple approach)
 */
function editEntry(id: string): void {
  const entry = entries.find((e) => e.id === id);
  if (!entry) {
    showNotification("Entry not found", "error");
    return;
  }

  // Populate the form with existing data
  const titleInput = document.getElementById("title") as HTMLInputElement;
  const contentInput = document.getElementById(
    "content"
  ) as HTMLTextAreaElement;
  const moodInputs =
    document.querySelectorAll<HTMLInputElement>('input[name="mood"]');

  if (titleInput) titleInput.value = entry.title;
  if (contentInput) contentInput.value = entry.content;

  // Select the correct mood radio button
  moodInputs.forEach((input) => {
    if (input.value.toUpperCase() === entry.mood) {
      input.checked = true;
    }
  });

  // Delete the old entry (we'll create a new one on submit)
  deleteEntry(id);

  // Scroll to form
  document.querySelector(".entry-form-section")?.scrollIntoView({
    behavior: "smooth",
  });

  showNotification("Edit the entry and save again", "success");
}

/**
 * Filter entries by mood and search query
 */
function getFilteredEntries(): Journal {
  let filtered = entries;

  // Apply mood filter
  if (currentFilter !== "all") {
    filtered = filtered.filter((entry) => entry.mood === currentFilter);
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query)
    );
  }

  return filtered;
}

/**
 * Apply filters and re-render entries
 */
function applyFiltersAndRender(): void {
  const filtered = getFilteredEntries();
  renderEntries(filtered);
}

/**
 * Handle form submission
 */
function handleFormSubmit(event: Event): void {
  event.preventDefault();

  const formData = getFormData();
  if (!formData) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  addEntry(formData);
  resetForm();
}

/**
 * Set up filter button event listeners
 */
function setupFilters(): void {
  const filterButtons =
    document.querySelectorAll<HTMLButtonElement>(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter") as Mood | "all";

      // Update active state
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Apply filter
      currentFilter = filter;
      applyFiltersAndRender();
    });
  });
}

/**
 * Set up search functionality
 */
function setupSearch(): void {
  const searchInput = document.getElementById(
    "search-input"
  ) as HTMLInputElement;

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchQuery = (event.target as HTMLInputElement).value;
      applyFiltersAndRender();
    });
  }
}

/**
 * Set up event delegation for entry actions (edit/delete)
 */
function setupEntryActions(): void {
  const entriesContainer = document.getElementById("entries-container");

  if (entriesContainer) {
    entriesContainer.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      // Handle delete button
      if (target.classList.contains("btn-delete")) {
        const id = target.getAttribute("data-id");
        if (id) deleteEntry(id);
      }

      // Handle edit button
      if (target.classList.contains("btn-edit")) {
        const id = target.getAttribute("data-id");
        if (id) editEntry(id);
      }
    });
  }
}

/**
 * Initialize the application
 */
export function init(): void {
  console.log("🚀 Initializing Journal App...");

  // Load entries from localStorage
  entries = loadEntries();
  console.log(`📚 Loaded ${entries.length} entries from storage`);

  // Initial render
  renderEntries(entries);

  // Set up form submission
  const form = document.getElementById("entry-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  // Set up filters
  setupFilters();

  // Set up search
  setupSearch();

  // Set up entry actions (edit/delete)
  setupEntryActions();

  console.log("✅ Journal App initialized successfully!");
}

// Auto-initialize when the DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
