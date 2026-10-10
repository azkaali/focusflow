import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/** Thin horizontal progress bar; `value` is 0–1. */
export function ProgressBar({ value }: { value: number }) {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
      <View style={[styles.fill, { backgroundColor: theme.accent, width: `${value * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
