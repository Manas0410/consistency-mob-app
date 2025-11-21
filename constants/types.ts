export type TaskData = {
  taskName: string;
  taskDescription: string;
  TaskStartDateTime: Date;
  duration: { hours: number; minutes: number };
  priority: 0 | 1 | 2;
  frequency: number[];
  category: string;
  sync?: boolean;
};
