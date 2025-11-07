import apicall from "@/constants/axios-config";

export const editTasks = async (taskId: string, date: Date, data: any) => {
  try {
    const response = await apicall.post("/task/edittasks", {
      taskId,
      date,
      updateData: data,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to update tasks: ${response.statusText}`);
    }

    return {
      success: true,
      data: response.data, // assuming your API returns { tasks: [...] }
      // data: tasks,
    };
  } catch (error) {
    console.error("Error updating tasks:", error);
    return {
      success: false,
      data: { message: "error" },
    };
  }
};
