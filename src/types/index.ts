/**
 * Shared TypeScript contracts between all three tracks.
 * Import from `@/types`:
 *   import type { Note, PlaybackState, TranscriptSegment } from '@/types';
 *
 * See ./README.md — these shapes change by agreement only.
 */

export type { Note, NewNote } from './note';
export type { PlaybackState, SupportedShow } from './playback';
export type { Transcript, TranscriptCue, TranscriptSegment } from './transcript';
