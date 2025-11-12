import TaskDetails from "@/components/task-description-page";
import { useGetViewTask } from "@/contexts/selected-view-task-context";

const personalTaskObject = {
  assignees: [
    {
      userId: "user_33yAvVPP8NDOdO1peRCOwEGrAF7",
      userName: "arjun",
      _id: "69136be300e312993f7fc757",
    },
    {
      userId: "user_34I8gORGw5qxetHgcLWl0RMXrNM",
      userName: "manas",
      _id: "69136be300e312993f7fc758",
    },
  ],
  taskName: "New",
  taskDescription: "",
  taskStartDateTime: "2025-11-11T17:15:30.070Z",
  endTime: "2025-11-11T17:45:30.070Z",
  isDone: true,
  isHabbit: false,
  category: "asdfg",
  duration: {
    hours: 0,
    minutes: 30,
  },
  priority: 0,
  frequency: [0],
  _id: "69136be300e312993f7fc756",
  createdAt: "2025-11-11T17:01:23.468Z",
  updatedAt: "2025-11-11T17:01:38.902Z",
};

const TaskDescription = () => {
  const { viewTask } = useGetViewTask();

  return (
    <TaskDetails
      task={viewTask}
      onEdit={(updated) => {
        // PUT /tasks/:id with `updated`
      }}
    />
  );
};

export default TaskDescription;
