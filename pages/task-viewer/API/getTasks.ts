import apicall from "@/constants/axios-config";

export const getTasksByDate = async (date: any) => {
  try {
    const response = await apicall.post("/task/gettasks", {date});
    console.log("Get Tasks Response:", response);

    if (response.status !== 200) {
      throw new Error(`Failed to get tasks: ${response.statusText}`);
    }

    return {
      success: true,
      data: response.data.tasks, // assuming your API returns { tasks: [...] }
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      success: false,
      data: { message: "error" },
    };
  }
};
