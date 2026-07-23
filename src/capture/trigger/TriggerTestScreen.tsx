import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTriggerDetector } from './useTriggerDetector';

/**
 * TriggerTestScreen — validates TOP-6's acceptance criteria:
 *
 *   1. User opens test screen.
 *   2. Grants microphone permission.
 *   3. Taps Start Listening.
 *   4. Speaks.
 *   5. Live transcript appears.
 *   6. Taps Stop Listening.
 *   7. Recognition stops.
 *   8. Transcript remains visible.
 *
 * No trigger detection UI yet by design — that's TOP-23. The
 * underlying TriggerDetector is already wired via useTriggerDetector,
 * so trigger events ARE being computed in the background even now,
 * but this screen intentionally doesn't surface them until TOP-23
 * scope begins — keeps sprint 1 focused on proving speech recognition
 * alone works end-to-end in the Dev Build.
 *
 * MUST run in the Expo Dev Build, not Expo Go.
 */
export function TriggerTestScreen() {
  const { isListening, liveTranscript, lastError, start, stop } =
    useTriggerDetector({ autoStart: false });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Speech Recognition Test (TOP-6)</Text>

      <Text>Status: {isListening ? 'Listening…' : 'Stopped'}</Text>

      <View style={styles.row}>
        <Button title="Start Listening" onPress={start} disabled={isListening} />
        <Button title="Stop Listening" onPress={stop} disabled={!isListening} />
      </View>

      <Text style={styles.section}>Live transcript:</Text>
      <Text style={styles.transcript}>{liveTranscript || '(nothing yet)'}</Text>

      {lastError && (
        <>
          <Text style={styles.section}>Last error:</Text>
          <Text>{lastError.message}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 8 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  section: { marginTop: 16, fontWeight: '600' },
  transcript: { fontSize: 16 },
  row: { flexDirection: 'row', gap: 12, marginVertical: 8 },
});


