import apicall from "@/constants/axios-config";

// 1. Create Task Plan (POST /taskplanner/task-plan)
export const createTaskPlan = async (planData: any) => {
  try {
    const response = await apicall.post("/taskplanner/task-plan", planData);
    console.log("Create Task Plan Response:", response);

    if (response.status !== 200) {
      throw new Error(`Failed to create task plan: ${response.statusText}`);
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating task plan:", error);
    return {
      success: false,
      data: { message: "error" },
    };
  }
};

// 2. Get Task Plan History (GET /taskplanner/task-plan/history)
export const getTaskPlanHistory = async (params: {
  pageNo?: number;
  pageSize?: number;
}) => {
  try {
    const response = await apicall.get("/taskplanner/task-plan/history", { params });
    console.log("Get Task Plan History Response:", response);

    if (response.status !== 200) {
      throw new Error(`Failed to get task plan history: ${response.statusText}`);
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching task plan history:", error);
    return {
      success: false,
      data: { message: "error" },
    };
  }
};

// 3. Handle Motivation Chat (POST /motivationchat/motivationchatresponse)
export const handleMotivationChat = async (chatData: any) => {
  try {
    const response = await apicall.post("/motivationchat/motivationchatresponse", chatData);
    console.log("Handle Motivation Chat Response:", response);

    if (response.status !== 200) {
      throw new Error(`Failed to handle motivation chat: ${response.statusText}`);
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error handling motivation chat:", error);
    return {
      success: false,
      data: { message: "error" },
    };
  }
};

// 4. Get Motivation Chat History (POST /motivationchat/motivationchathistory)
export const getMotivationChatHistory = async (historyData: any) => {
  try {
    const response = await apicall.post("/motivationchat/motivationchathistory", historyData);
    console.log("Get Motivation Chat History Response:", response);

    if (response.status !== 200) {
      throw new Error(`Failed to get motivation chat history: ${response.statusText}`);
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching motivation chat history:", error);
    return {
      success: false,
      data: { message: "error" },
    };
  }
};
