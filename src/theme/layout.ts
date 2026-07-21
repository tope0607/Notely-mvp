/**
 * Notely layout constants. Track 1 (Design + Frontend) owns this file. See TOP-6.
 */

import { Platform } from 'react-native';

/** Height reserved for the bottom tab bar so scroll content clears it. */
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;

/** Max readable content width on large / web screens. */
export const MaxContentWidth = 800;
