import TaskDetails from "@/components/task-description-page";
import { useToast } from "@/components/ui/toast";
import { useGetViewTask } from "@/contexts/selected-view-task-context";
import { editTeamTask } from "@/pages/Team/API/api-calls";
import { useLocalSearchParams, useRouter } from "expo-router";

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
  const { teamid } = useLocalSearchParams();
  const router = useRouter();

  const { success, error } = useToast();

  const handleChange = async (updatedData: any) => {
    try {
      // Simulate an API call
      const teamIdString = Array.isArray(teamid) ? teamid[0] : teamid;
      const res = await editTeamTask(
        teamIdString,
        updatedData?._id,
        updatedData
      );
      if (res.success) {
        success("task updated successfully");
      } else {
        console.error("Error updating status:", res.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
    }
  };

  return <TaskDetails task={viewTask} onEdit={handleChange} />;
};

export default TaskDescription;
