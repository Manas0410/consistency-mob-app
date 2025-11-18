import apicall from "@/constants/axios-config";

// 1. Create Task Plan (POST /taskplanner/task-plan)
export const getStreakData = async () => {
  try {
    const response = await apicall.post("/streak/getStreak", {
      days: 30,
      page: 1,
    });

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

//  currentStreak: doc.currentStreak || 0,
//       count: latestFirst.length,
//       page: p,
//       pageSize: d,
//       totalAvailable: total,
//       hasMore,
//       streakData: latestFirst,
