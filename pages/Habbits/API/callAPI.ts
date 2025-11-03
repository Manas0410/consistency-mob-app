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
