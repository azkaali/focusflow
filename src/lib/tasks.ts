import { createId, createPersistedStore } from '@/lib/persisted-store';
import type { Task } from '@/lib/types';

const store = createPersistedStore<Task[]>('focusflow.tasks', []);

export function useTasks() {
  return store.use();
}

export function useTask(id: string | undefined) {
  return useTasks().find((task) => task.id === id);
}

/** Saves new tasks (newest first) and returns them. */
export function addTasks(drafts: { title: string; steps: string[] }[]) {
  const created: Task[] = drafts.map((draft) => ({
    id: createId(),
    title: draft.title,
    createdAt: Date.now(),
    steps: draft.steps.map((text) => ({ id: createId(), text, done: false })),
  }));
  store.set([...created, ...store.get()]);
  return created;
}

export function toggleStep(taskId: string, stepId: string) {
  store.set(
    store.get().map((task) =>
      task.id !== taskId
        ? task
        : {
            ...task,
            steps: task.steps.map((step) =>
              step.id === stepId ? { ...step, done: !step.done } : step
            ),
          }
    )
  );
}

export function deleteTask(taskId: string) {
  store.set(store.get().filter((task) => task.id !== taskId));
}
