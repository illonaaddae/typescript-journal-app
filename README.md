# Journal App 📔

A modern, dynamic Journal Application built with TypeScript, focusing on type safety and clean architecture.

## Features

- Type-safe journal entry management
- Local storage persistence
- Mood tracking with enum types
- Create, read, and manage journal entries
- Strict TypeScript type checking

## Project Structure

```
journal-app/
├── src/
│   ├── types.ts      # Type definitions and interfaces
│   ├── storage.ts    # LocalStorage management
│   ├── journal.ts    # Core journal logic (to be implemented)
│   └── ui.ts         # UI components (to be implemented)
├── dist/             # Compiled JavaScript output
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project dependencies
```

## Technologies

- **TypeScript 5.9.3** - Type-safe JavaScript
- **ES2020** - Modern JavaScript features
- **LocalStorage API** - Client-side data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Compile TypeScript
npx tsc

# Watch mode (if configured)
npx tsc --watch
```

## Type System

The application uses a robust type system with:

- **Mood Enum**: Predefined mood states (HAPPY, SAD, MOTIVATED, STRESSED, CALM)
- **JournalEntry Interface**: Type-safe journal entry structure
- **Generic Helper Functions**: Reusable type-safe utilities

## What's Implemented

Type definitions (`types.ts`)

- Mood enum
- JournalEntry interface
- Helper types and generic functions

Storage layer (`storage.ts`)

- Load journal entries from LocalStorage
- Save journal entries to LocalStorage
- Type guards and error handling

  In Progress

- Core journal logic
- User interface
- HTML/CSS styling

## License

ISC
