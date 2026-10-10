import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { requestBreakdown } from '@/lib/api';
import { addTasks } from '@/lib/tasks';
import { FREE_BREAKDOWNS_PER_WEEK, recordBreakdown, useBreakdownsLeft } from '@/lib/usage';

export default function BrainDumpScreen() {
  const theme = useTheme();
  const breakdownsLeft = useBreakdownsLeft();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBreakdown() {
    setLoading(true);
    setError(null);
    try {
      const { tasks } = await requestBreakdown(text);
      if (tasks.length === 0) {
        throw new Error("Couldn't find a task in that. Try describing something you need to do.");
      }
      recordBreakdown();
      const [first] = addTasks(tasks);
      setText('');
      router.push({ pathname: '/tasks/[id]', params: { id: first.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ThemedText type="subtitle">Brain dump</ThemedText>
      <ThemedText themeColor="textSecondary">
        Type whatever&apos;s on your mind, messy is fine. We&apos;ll turn it into small steps you
        can start right now.
      </ThemedText>

      <TextInput
        multiline
        value={text}
        onChangeText={setText}
        editable={!loading}
        maxLength={2000}
        placeholder="e.g. need to do taxes, no idea where the forms are, also email Sam back about Friday…"
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel="Brain dump"
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
      />

      {error && (
        <ThemedText type="small" style={{ color: theme.danger }}>
          {error}
        </ThemedText>
      )}

      <Button
        title="Break it down"
        onPress={handleBreakdown}
        loading={loading}
        disabled={!text.trim() || breakdownsLeft === 0}
      />

      <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
        {breakdownsLeft > 0
          ? `${breakdownsLeft} of ${FREE_BREAKDOWNS_PER_WEEK} free breakdowns left this week`
          : "You've used this week's free breakdowns. They reset on Monday."}
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 180,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  center: {
    textAlign: 'center',
  },
});
