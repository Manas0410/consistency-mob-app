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
    const response = await apicall.get("/taskplanner/task-plan/history", {
      params,
    });
    console.log("Get Task Plan History Response:", response);

    if (response.status !== 200) {
      throw new Error(
        `Failed to get task plan history: ${response.statusText}`
      );
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
    const response = await apicall.post(
      "/motivationchat/motivationchatresponse",
      chatData
    );
    console.log("Handle Motivation Chat Response:", response);

    if (response.status !== 200) {
      throw new Error(
        `Failed to handle motivation chat: ${response.statusText}`
      );
    }

    return {
      success: true,
      data: response.data?.aiResponse,
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
    const response = await apicall.post(
      `/motivationchat/motivationchathistory?pageNo=${historyData.pageNo}&pageSize=${historyData.pageSize}`
    );
    console.log("Get Motivation Chat History Response:", response);

    if (response.status !== 200) {
      throw new Error(
        `Failed to get motivation chat history: ${response.statusText}`
      );
    }

    return {
      success: true,
      data: response.data?.chats || [],
    };
  } catch (error) {
    console.error("Error fetching motivation chat history:", error);
    return {
      success: false,
      data: { message: "error" },
    };
  }
};

// {
//   "userId": "124567",
//   "pageNo": 1,
//   "pageSize": 10,
//   "chats": [
//     {
//       "_id": "68ef7302a06ec2c2d9f93fc7",
//       "userId": "124567",
//       "message": "but i have a head ache today",
//       "response": "It's okay to have days where you feel like this, but remember that even with a headache, you're still moving forward. Rest if you need to, and know that this moment is just one small part of your journey. You've got this.<｜begin▁of▁sentence｜>",
//       "createdAt": "2025-10-15T10:10:10.464Z",
//       "__v": 0
//     },
//     {
//       "_id": "68ef728def47a67174f70241",
//       "userId": "124567",
//       "message": "but i have a head ache today",
//       "response": "I'm sorry to hear that—headaches can really drain your energy and motivation. Remember to take it easy, rest well, and be kind to yourself. This is just a temporary setback, and you'll bounce back when you're feeling better!<｜begin▁of▁sentence｜>",
//       "createdAt": "2025-10-15T10:08:13.872Z",
//       "__v": 0
//     },
//     {
//       "_id": "68ef725def47a67174f7023f",
//       "userId": "124567",
//       "message": "feeling demotivated",
//       "response": "I know it's tough when motivation feels out of reach. Remember, even the longest journey begins with a single step. You've overcome challenges before, and you have the strength to do it again. Let's focus on one small thing you can do right now to move forward. You've got this.<｜begin▁of▁sentence｜>",
//       "createdAt": "2025-10-15T10:07:25.853Z",
//       "__v": 0
//     },
//     {
//       "_id": "68ef721d0ea6f557885a17c8",
//       "userId": "124567",
//       "message": "feeling demotivated",
//       "response": "Of course! Here is a personalized and empathetic response.\n\n***\n\nHey there. I'm really sorry to hear you're feeling that way. It's completely okay and honestly, so very human to feel like this sometimes. Everyone has these moments, even the people who seem to have it all together.\n\nPlease remember that your worth isn't defined by your productivity or a single bad day. You are so much more than that. You're carrying a lot, and just getting through the day is an achievement in itself.\n\nHow about we try something small together? Don't think about the giant mountain; let's just focus on one tiny, manageable step. What's one tiny thing you can do right now that would make you feel even 1% better? It could be making a favorite drink, listening to one favorite song, or just stepping outside for two minutes.\n\nNo pressure at all. Just know that I'm here, you're not alone in this, and I believe in your ability to get through this moment.<｜begin▁of▁sentence｜>",
//       "createdAt": "2025-10-15T10:06:21.975Z",
//       "__v": 0
//     }
//   ]
// }
