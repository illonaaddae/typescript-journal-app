import { JournalEntry, Journal, Mood } from "./types.js";

/**
 * UI Module - Handles all DOM rendering and updates
 */

// Mood emoji mapping
const MOOD_EMOJIS: Record<Mood, string> = {
  [Mood.HAPPY]: "😊",
  [Mood.SAD]: "😢",
  [Mood.MOTIVATED]: "💪",
  [Mood.STRESSED]: "😰",
  [Mood.CALM]: "😌",
};

/**
 * Format timestamp to readable date string
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Create HTML for a single journal entry card
 */
function createEntryCard(entry: JournalEntry): string {
  const moodEmoji = MOOD_EMOJIS[entry.mood];
  const formattedDate = formatDate(entry.timestamp);

  return `
    <div class="entry-card" data-entry-id="${entry.id}" data-mood="${
      entry.mood
    }">
      <div class="entry-header">
        <div>
          <h3 class="entry-title">${escapeHtml(entry.title)}</h3>
          <p class="entry-timestamp">${formattedDate}</p>
        </div>
        <span class="entry-mood">${moodEmoji}</span>
      </div>
      <p class="entry-content">${escapeHtml(entry.content)}</p>
      <div class="entry-actions">
        <button class="btn-edit" data-id="${entry.id}">Edit</button>
        <button class="btn-delete" data-id="${entry.id}">Delete</button>
      </div>
    </div>
  `;
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Render all entries to the DOM
 */
export function renderEntries(
  entries: Journal,
  containerId: string = "entries-container"
): void {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  // Clear existing content
  container.innerHTML = "";

  // Show empty state if no entries
  if (entries.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <p class="empty-state-text">No journal entries yet. Start writing to track your mood!</p>
      </div>
    `;
    return;
  }

  // Render entries (newest first)
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);
  container.innerHTML = sortedEntries.map(createEntryCard).join("");
}

/**
 * Show a temporary notification message
 */
export function showNotification(
  message: string,
  type: "success" | "error" = "success"
): void {
  // Remove any existing notifications
  const existing = document.querySelector(".notification");
  if (existing) {
    existing.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${
      type === "success"
        ? "linear-gradient(135deg, #10b981, #059669)"
        : "linear-gradient(135deg, #ef4444, #dc2626)"
    };
    color: white;
    border-radius: 0.75rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
    font-weight: 500;
  `;

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Get form data as a partial entry object
 */
export function getFormData(formId: string = "entry-form"): {
  title: string;
  content: string;
  mood: Mood;
} | null {
  const form = document.getElementById(formId) as HTMLFormElement;
  if (!form) {
    console.error(`Form with id "${formId}" not found`);
    return null;
  }

  const formData = new FormData(form);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const moodValue = formData.get("mood") as string;

  // Validate mood
  const mood = moodValue?.toUpperCase() as Mood;
  if (!Object.values(Mood).includes(mood)) {
    console.error("Invalid mood value");
    return null;
  }

  return { title, content, mood };
}

/**
 * Reset the form
 */
export function resetForm(formId: string = "entry-form"): void {
  const form = document.getElementById(formId) as HTMLFormElement;
  if (form) {
    form.reset();
  }
}

/**
 * Add CSS animation for notifications
 */
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
