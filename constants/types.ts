export type TaskData = {
  taskName: string;
  taskDescription: string;
  TaskStartDateTime: Date;
  duration: {hours: number; minutes: number};
  priority: "Low" | "Medium" | "High";
  frequency: number[];
};
