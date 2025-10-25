import apicall from "@/constants/axios-config";

export const addTask = async (taskData: any) => {
  try {
    const response = await apicall.post("/task/addtasks", {
      tasks: [taskData],
    });
    console.log("Add Task Response:", response);

    if (response.status !== 201) {
      throw new Error(`Failed to add task: ${response.statusText}`);
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error adding task:", error);
    return {
      success: false,
      data: { message: "error" },
    };
  }
};
