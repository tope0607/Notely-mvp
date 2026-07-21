/**
 * Notes repository — local, on-device CRUD for `Note`.
 *
 * Track 2 — Backend / Data. Linear: TOP-20.
 * MVP is local-only (no backend). TODO(TOP-20): back this with on-device
 * storage. Recommend `expo-sqlite` for query-ability, or AsyncStorage for a
 * simpler start (list whichever you pick as a dependency; do not install here).
 * Keep this module the ONLY place that touches the storage engine.
 */

import type { NewNote, Note } from '@/types';

/** Create and persist a new note; returns the stored note (with id/createdAt). */
export async function createNote(input: NewNote): Promise<Note> {
  // TODO(TOP-20): generate id + createdAt, persist, return.
  throw new Error('createNote not implemented (TOP-20)');
}

/** List all notes, newest first. */
export async function listNotes(): Promise<Note[]> {
  // TODO(TOP-20)
  throw new Error('listNotes not implemented (TOP-20)');
}

/** Fetch a single note by id, or `null` if not found. */
export async function getNote(id: string): Promise<Note | null> {
  // TODO(TOP-20)
  throw new Error('getNote not implemented (TOP-20)');
}

/** Update mutable fields (e.g. `userNote`) of an existing note. */
export async function updateNote(id: string, patch: Partial<NewNote>): Promise<Note> {
  // TODO(TOP-20)
  throw new Error('updateNote not implemented (TOP-20)');
}

/** Delete a note by id. */
export async function deleteNote(id: string): Promise<void> {
  // TODO(TOP-20)
  throw new Error('deleteNote not implemented (TOP-20)');
}
