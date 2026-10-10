import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { deleteTask, toggleStep, useTask } from '@/lib/tasks';

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/tasks');
  }
}

function confirmDelete(onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm('Delete this task?')) onConfirm();
    return;
  }
  Alert.alert('Delete this task?', undefined, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
}

export default function TaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = useTask(id);
  const theme = useTheme();

  if (!task) {
    return (
      <Screen>
        <ThemedText themeColor="textSecondary">This task doesn&apos;t exist anymore.</ThemedText>
        <Button title="Back to tasks" variant="secondary" onPress={goBack} />
      </Screen>
    );
  }

  const done = task.steps.filter((step) => step.done).length;
  const nextStepId = task.steps.find((step) => !step.done)?.id;
  const finished = done === task.steps.length;

  return (
    <Screen>
      <Pressable accessibilityRole="button" onPress={goBack} hitSlop={Spacing.three}>
        <ThemedText type="linkPrimary">‹ Tasks</ThemedText>
      </Pressable>

      <ThemedText type="subtitle">{task.title}</ThemedText>
      <View style={styles.progress}>
        <ProgressBar value={task.steps.length ? done / task.steps.length : 0} />
        <ThemedText type="small" themeColor="textSecondary">
          {finished ? 'All done. Nice work!' : `${done} of ${task.steps.length} steps done`}
        </ThemedText>
      </View>

      <View style={styles.steps}>
        {task.steps.map((step) => {
          const isNext = step.id === nextStepId;
          return (
            <Pressable
              key={step.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: step.done }}
              onPress={() => toggleStep(task.id, step.id)}
              style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView
                type={isNext ? 'backgroundSelected' : 'backgroundElement'}
                style={[styles.step, isNext && { borderColor: theme.accent }]}>
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: step.done ? theme.accent : theme.textSecondary },
                    step.done && { backgroundColor: theme.accent },
                  ]}>
                  {step.done && (
                    <ThemedText type="smallBold" style={{ color: theme.onAccent }}>
                      ✓
                    </ThemedText>
                  )}
                </View>
                <View style={styles.stepText}>
                  {isNext && (
                    <ThemedText type="smallBold" style={{ color: theme.accent }}>
                      Next step
                    </ThemedText>
                  )}
                  <ThemedText
                    themeColor={step.done ? 'textSecondary' : 'text'}
                    style={step.done && styles.doneText}>
                    {step.text}
                  </ThemedText>
                </View>
              </ThemedView>
            </Pressable>
          );
        })}
      </View>

      <Button
        title="Delete task"
        variant="secondary"
        onPress={() =>
          confirmDelete(() => {
            deleteTask(task.id);
            goBack();
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: {
    gap: Spacing.two,
  },
  steps: {
    gap: Spacing.two,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    flex: 1,
  },
  doneText: {
    textDecorationLine: 'line-through',
  },
  pressed: {
    opacity: 0.7,
  },
});
