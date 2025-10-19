import apicall from "@/constants/axios-config";

const tasks = [
  {
    userId: "userId123",
    taskName: "Early Wakeup",
    taskDescription: "Start your day fresh at 6 AM.",
    taskStartDateTime: "2025-09-21T06:00:00.000Z",
    endTime: "2025-09-21T07:00:00.000Z",
    isDone: true,
    isHabbit: true,
    duration: { hours: 1, minutes: 0 },
    priority: 2,
    frequency: [8],
  },
  {
    userId: "userId123",
    taskName: "Lunch Break",
    taskDescription: "",
    taskStartDateTime: "2025-09-21T12:00:00.000Z",
    endTime: "2025-09-21T13:00:00.000Z",
    isDone: false,
    isHabbit: false,
    duration: { hours: 1, minutes: 0 },
    priority: 1,
    frequency: [8],
  },
  {
    userId: "userId123",
    taskName: "Project Standup",
    taskDescription: "Team sync meeting.",
    taskStartDateTime: "2025-09-21T13:00:00.000Z",
    endTime: "2025-09-21T14:00:00.000Z",
    isDone: false,
    isHabbit: false,
    duration: { hours: 1, minutes: 0 },
    priority: 1,
    frequency: [1, 3, 8],
  },
  {
    userId: "userId123",
    taskName: "Evening Review",
    taskDescription: "Summarize daily achievements.",
    taskStartDateTime: "2025-09-21T17:00:00.000Z",
    endTime: "2025-09-21T18:00:00.000Z",
    isDone: false,
    isHabbit: false,
    duration: { hours: 1, minutes: 0 },
    priority: 0,
    frequency: [8],
  },
  {
    userId: "userId123",
    taskName: "Family Time",
    taskDescription: "Dinner and catch up.",
    taskStartDateTime: "2025-09-21T20:00:00.000Z",
    endTime: "2025-09-21T21:00:00.000Z",
    isDone: false,
    isHabbit: false,
    duration: { hours: 1, minutes: 0 },
    priority: 1,
    frequency: [8],
  },
];

// Use Task.insertMany(tasks) if using Mongoose to add to DB.

export const getTasksByDate = async (date: any) => {
  try {
    const response = await apicall.post("/task/gettasks", { date });
    console.log("Get Tasks Response:", response);

    if (response.status !== 200) {
      throw new Error(`Failed to get tasks: ${response.statusText}`);
    }

    return {
      success: true,
      data: response.data.tasks, // assuming your API returns { tasks: [...] }
      // data: tasks,
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      success: false,
      data: { message: "error" },
    };
  }
};
