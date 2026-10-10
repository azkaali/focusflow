import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTasks } from '@/lib/tasks';

export default function TasksScreen() {
  const tasks = useTasks();

  return (
    <Screen>
      <ThemedText type="subtitle">Tasks</ThemedText>

      {tasks.length === 0 ? (
        <ThemedView type="backgroundElement" style={styles.empty}>
          <ThemedText themeColor="textSecondary" style={styles.center}>
            No tasks yet. Start with a brain dump and we&apos;ll break it into steps.
          </ThemedText>
          <Link href="/">
            <ThemedText type="linkPrimary">Go to brain dump</ThemedText>
          </Link>
        </ThemedView>
      ) : (
        tasks.map((task) => {
          const done = task.steps.filter((step) => step.done).length;
          return (
            <Link key={task.id} href={{ pathname: '/tasks/[id]', params: { id: task.id } }} asChild>
              <Pressable style={({ pressed }) => pressed && styles.pressed}>
                <ThemedView type="backgroundElement" style={styles.card}>
                  <View style={styles.cardHeader}>
                    <ThemedText style={styles.title} numberOfLines={2}>
                      {task.title}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {done}/{task.steps.length}
                    </ThemedText>
                  </View>
                  <ProgressBar value={task.steps.length ? done / task.steps.length : 0} />
                </ThemedView>
              </Pressable>
            </Link>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  title: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
