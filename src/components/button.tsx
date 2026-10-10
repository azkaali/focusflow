import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
};

export function Button({ title, onPress, variant = 'primary', disabled, loading }: ButtonProps) {
  const theme = useTheme();
  const primary = variant === 'primary';
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: primary ? theme.accent : theme.backgroundElement },
        inactive && styles.inactive,
        pressed && styles.pressed,
      ]}>
      {loading ? (
        <ActivityIndicator color={primary ? theme.onAccent : theme.text} />
      ) : (
        <ThemedText type="smallBold" style={{ color: primary ? theme.onAccent : theme.text }}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
