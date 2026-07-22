import {
  ExpoSpeechRecognitionModule,
  ExpoSpeechRecognitionModuleEmitter,
} 
from 'expo-speech-recognition';
import { ISpeechRecognitionService }
from '../domain/interfaces';
import { PermissionDeniedError, SpeechRecognitionError } 
from '/domain/errors';

export class SpeechRecognitionService implements ISpeechRecognitionService {
  private transcriptListeners: Array<(transcript: string, isFinal: boolean) => void> = [];
  private errorListeners: Array<(error: Error) => void> = [];
  private resultSubscription: { remove: () => void } | null = null;
  private errorSubscription: { remove: () => void } | null = null;
  private endSubscription: { remove: () => void } | null = null;
  private shouldKeepListening = false;

  async requestPermission(): Promise<boolean> {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      throw new PermissionDeniedError();
    }
    return result.granted;
  }

  async start(): Promise<void> {
    this.shouldKeepListening = true;
    this.subscribeIfNeeded();

    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: true,
    });
  }

  async stop(): Promise<void> {
    this.shouldKeepListening = false;
    ExpoSpeechRecognitionModule.stop();
  }

  onTranscriptUpdate(callback: (transcript: string, isFinal: boolean) => void): void {
    this.transcriptListeners.push(callback);
  }

  onError(callback: (error: Error) => void): void {
    this.errorListeners.push(callback);
  }

  private subscribeIfNeeded() {
    if (this.resultSubscription) return; // already subscribed

    this.resultSubscription = ExpoSpeechRecognitionModuleEmitter.addListener(
      'result',
      (event: any) => {
        const results = event?.results ?? [];
        const isFinal = Boolean(event?.isFinal);
        for (const result of results) {
          const transcript = result?.transcript;
          if (transcript) {
            this.transcriptListeners.forEach((cb) => cb(transcript, isFinal));
          }
        }
      },
    );

    this.errorSubscription = ExpoSpeechRecognitionModuleEmitter.addListener(
      'error',
      (event: any) => {
        const error = new SpeechRecognitionError(
          event?.error ?? 'unknown',
          event?.message ?? 'Speech recognition error',
        );
        this.errorListeners.forEach((cb) => cb(error));
      },
    );

    this.endSubscription = ExpoSpeechRecognitionModuleEmitter.addListener(
      'end',
      () => {
        // Sessions end after a pause — restart to simulate continuous
        // listening while the caller still wants to be listening.
        if (this.shouldKeepListening) {
          ExpoSpeechRecognitionModule.start({
            lang: 'en-US',
            interimResults: true,
            continuous: true,
          });
        }
      },
    );
  }

  /** Call when the service is no longer needed (e.g. screen unmount)
   *  to release native listeners entirely. */
  dispose(): void {
    this.shouldKeepListening = false;
    this.resultSubscription?.remove();
    this.errorSubscription?.remove();
    this.endSubscription?.remove();
    this.resultSubscription = null;
    this.errorSubscription = null;
    this.endSubscription = null;
    this.transcriptListeners = [];
    this.errorListeners = [];
  }
}