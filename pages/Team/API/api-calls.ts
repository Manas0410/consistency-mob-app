import apicall from "@/constants/axios-config";

// Type definitions
export interface Member {
  userId: string;
  userName: string;
  role?: string;
}

export interface TeamTask {
  assignees: Member[];
  taskName: string;
  taskDescription?: string;
  taskStartDateTime: string; // ISO
  endTime: string; // ISO
  isDone?: boolean;
  isHabbit?: boolean;
  duration: { hours: number; minutes: number };
  priority: 0 | 1 | 2;
  frequency: number[];
}

export interface Team {
  _id: string;
  teamName: string;
  members: Member[];
  tasks: TeamTask[];
}

// 1. Create Team
export const createTeam = async (
  teamName: string,
  userName: string,
  mail: string
): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await apicall.post("/team/create-team", {
      teamName,
      userName,
      mail,
    });
    if (response.status !== 201)
      throw new Error(`Failed to create team: ${response.statusText}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating team:", error);
    return { success: false, data: { message: "error" } };
  }
};

// 2. Invite Member
export const requestTojoin = async (payload: {
  userName: string;
  mail: string;
  teamId: string;
}): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await apicall.post("/team/invite-member", payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error inviting member:", error);
    return { success: false, data: { message: "error" } };
  }
};

// 3. Accept Team Invite
export const acceptTeamInvite = async (payload: {
  teamId: string;
  requestUserId: string;
}): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await apicall.post("/team/accept-invite", payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error accepting invite:", error);
    return { success: false, data: { message: "error" } };
  }
};

// 4. Get Tasks (for a date)
export const getTeamTasks = async (
  teamId: string,
  date: string
): Promise<{ success: boolean; data: TeamTask[] | { message: string } }> => {
  try {
    const response = await apicall.post("/team/tasks", { teamId, date });
    if (response.status !== 200)
      throw new Error(`Failed to get tasks: ${response.statusText}`);
    return { success: true, data: response.data.tasks };
  } catch (error) {
    console.error("Error getting team tasks:", error);
    return { success: false, data: { message: "error" } };
  }
};

// 5. Edit Team Task
export const editTeamTask = async (
  teamId: string,
  taskId: string,
  updateData: Partial<TeamTask>
): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await apicall.post("/team/tasks/edit", {
      teamId,
      taskId,
      updateData,
    });
    if (response.status !== 200)
      throw new Error(`Failed to edit task: ${response.statusText}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error editing team task:", error);
    return { success: false, data: { message: "error" } };
  }
};

// 6. Add Team Task
export const addTeamTask = async (
  teamId: string,
  taskData: TeamTask
): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await apicall.post("/team/tasks/add", {
      teamId,
      taskData,
    });
    if (response.status !== 201)
      throw new Error(`Failed to add team task: ${response.statusText}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding team task:", error);
    return { success: false, data: { message: "error" } };
  }
};

// 7. Get All Teams
export const getAllTeams = async (
  query: string
): Promise<{
  success: boolean;
  data: Team[] | { message: string };
}> => {
  try {
    const response = await apicall.get(`/team/all?search=${query}`);
    if (response.status !== 200)
      throw new Error(`Failed to get teams: ${response.statusText}`);
    return { success: true, data: response.data.teams };
  } catch (error) {
    console.error("Error getting teams:", error);
    return { success: false, data: { message: "error" } };
  }
};

// 8. Delete Team
export const deleteTeam = async (
  teamId: string
): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await apicall.post("/team/delete", { teamId });
    if (response.status !== 200)
      throw new Error(`Failed to delete team: ${response.statusText}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { success: false, data: { message: "error" } };
  }
};

export const getTeamMembers = async (
  teamId: string
): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await apicall.post("/team/get-members", { teamId });
    if (response.status !== 200)
      throw new Error(`Failed to delete team: ${response.statusText}`);
    return { success: true, data: response.data?.members };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { success: false, data: { message: "error" } };
  }
};

export const acceptTeamRequest = async (teamId, requestUserId) => {
  try {
    const response = await apicall.post("/team/accept-invite", {
      teamId,
      requestUserId,
    });
    if (response.status !== 200)
      throw new Error(`Failed to delete team: ${response.statusText}`);
    return { success: true, data: response.data?.members };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { success: false, data: { message: "error" } };
  }
};

export const rejectTeamRequest = async (teamId, requestUserId) => {
  try {
    const response = await apicall.post("/team/accept-invite", {
      teamId,
      requestUserId,
    });
    if (response.status !== 200)
      throw new Error(`Failed to delete team: ${response.statusText}`);
    return { success: true, data: response.data?.members };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { success: false, data: { message: "error" } };
  }
};

export const removeFromTeam = async (teamId, removeUserId) => {
  try {
    const response = await apicall.post("/team/remove-member", {
      teamId,
      removeUserId,
    });
    if (response.status !== 200)
      throw new Error(`Failed to  removee user: ${response.statusText}`);
    return { success: true, data: response.data?.members };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { success: false, data: { message: "error" } };
  }
};
export const makeAdmin = async (teamId, targetUserId) => {
  try {
    const response = await apicall.post("/team/make-admin", {
      teamId,
      targetUserId,
    });
    if (response.status !== 200)
      throw new Error(`Failed to  removee user: ${response.statusText}`);
    return { success: true, data: response.data?.members };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { success: false, data: { message: "error" } };
  }
};
export const exitTeam = async (teamId) => {
  try {
    const response = await apicall.post("/team/remove-member", {
      teamId,
    });
    if (response.status !== 200)
      throw new Error(`Failed to  removee user: ${response.statusText}`);
    return { success: true, data: response.data?.members };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { success: false, data: { message: "error" } };
  }
};

export const DeleteTeam = async (teamId) => {
  try {
    const response = await apicall.post("/team/delete", {
      teamId,
    });
    if (response.status !== 200)
      throw new Error(`Failed to  removee user: ${response.statusText}`);
    return { success: true, data: response.data?.members };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { success: false, data: { message: "error" } };
  }
};
