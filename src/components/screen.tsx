import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Scrollable, centered page that clears the safe area and the tab bar on every platform. */
export function Screen({ children }: { children: ReactNode }) {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top + Spacing.three,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six + Spacing.four,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInset={insets}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Platform.select({ ios: Spacing.three }),
    gap: Spacing.three,
  },
});
