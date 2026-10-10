export type Step = {
  id: string;
  text: string;
  done: boolean;
};

export type Task = {
  id: string;
  title: string;
  steps: Step[];
  createdAt: number;
};

/** Response body of `POST /api/breakdown`. */
export type BreakdownResponse = {
  tasks: { title: string; steps: string[] }[];
};
