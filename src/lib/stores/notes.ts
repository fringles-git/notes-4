import { writable } from 'svelte/store';

export type Note = {
  id: string;
  title: string;
  body: string;
  folder: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};

const storageKey = 'notes-4-state';

const seedNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Refactor the dock',
    body: 'Use one dock primitive. Remove tiny feature-specific overrides and keep all buttons aligned to the same spacing and radius scale.',
    folder: 'Product',
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    updatedAt: Date.now() - 1000 * 60 * 30
  },
  {
    id: 'note-2',
    title: 'Design tokens',
    body: 'Define border radius, spacing, color, shadows, typography once. Let every component read from the same variables.',
    folder: 'System',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 70,
    updatedAt: Date.now() - 1000 * 60 * 15
  }
];

function loadInitialNotes(): Note[] {
  if (typeof window === 'undefined') {
    return seedNotes;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return seedNotes;
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) && parsed.length ? parsed : seedNotes;
  } catch {
    return seedNotes;
  }
}

export const notes = writable<Note[]>(loadInitialNotes());

notes.subscribe((value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }
});

export function createNote(input: Partial<Note> = {}): Note {
  const now = Date.now();

  return {
    id: input.id ?? `note-${now}`,
    title: input.title ?? 'Untitled note',
    body: input.body ?? '',
    folder: input.folder ?? 'Inbox',
    pinned: input.pinned ?? false,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now
  };
}

export function addNote(partial: Partial<Note> = {}): Note {
  const created = createNote(partial);
  notes.update((current) => [created, ...current]);
  return created;
}

export function updateNote(id: string, patch: Partial<Note>): void {
  notes.update((current) =>
    current.map((note) =>
      note.id === id
        ? { ...note, ...patch, updatedAt: Date.now() }
        : note
    )
  );
}

export function togglePin(id: string): void {
  notes.update((current) =>
    current.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned, updatedAt: Date.now() } : note
    )
  );
}

export function deleteNote(id: string): void {
  notes.update((current) => current.filter((note) => note.id !== id));
}

export function sortNotes(list: Note[]): Note[] {
  return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);
}
