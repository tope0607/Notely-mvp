export abstract class NotelyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/** Microphone / speech recognition permission was denied by the user
 *  or the OS. Thrown from SpeechRecognitionService.requestPermission()
 *  callers, not swallowed silently. */
export class PermissionDeniedError extends NotelyError {
  constructor(message = 'Microphone or speech recognition permission was denied') {
    super(message);
  }
}

/** The underlying speech recognition engine failed — e.g. no speech
 *  detected, recognizer busy, network required but unavailable. */
export class SpeechRecognitionError extends NotelyError {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

/** IEpisodeMatcher could not find a candidate above the confidence
 *  threshold. Callers should surface a manual episode picker rather
 *  than guessing. */
export class EpisodeNotMatchedError extends NotelyError {
  constructor(message = 'No RSS episode matched the current playback state with sufficient confidence') {
    super(message);
  }
}

/** ITranscriptProvider could not retrieve or parse a transcript for
 *  a matched episode (feed down, no transcript published, parse
 *  failure). */
export class TranscriptUnavailableError extends NotelyError {
  constructor(message = 'Transcript could not be retrieved for the matched episode') {
    super(message);
  }
}

/** ISegmentExtractor could not produce a segment — e.g. the trigger
 *  timestamp falls outside the transcript's covered range. */
export class SegmentExtractionError extends NotelyError {
  constructor(message = 'Could not extract a transcript segment for the given trigger event') {
    super(message);
  }
}
