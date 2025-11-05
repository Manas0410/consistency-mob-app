import apicall from "@/constants/axios-config";

export const createHabbit = async (
  goal: string
): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await apicall.post("/motivationchat/create-habbit", {
      goal,
    });
    if (response.status !== 200)
      throw new Error(`Failed to create team: ${response.statusText}`);
    return { success: true, data: response.data?.habits };
  } catch (error) {
    console.error("Error creating team:", error);
    return { success: false, data: { message: "error" } };
  }
};

export const getHabbit = async (date: any) => {
  try {
    const response = await apicall.post("/task/getHabits", { date });

    if (response.status !== 200) {
      throw new Error(`Failed to get tasks: ${response.statusText}`);
    }

    return {
      success: true,
      data: response.data.habits, // assuming your API returns { tasks: [...] }
      // data: tasks,
    };
  } catch (error) {
    console.error("Error fetching habbit:", error);
    return {
      success: false,
      data: { message: "error" },
    };
  }
};
