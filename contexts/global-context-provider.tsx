import { ReactNode } from "react";
import { AddTaskBottomSheetProvider } from "./add-task-context";
import { AddTeamBottomSheetProvider } from "./add-team-context";
import { AddTeamMemberBottomSheetProvider } from "./add-team-member-context";
import { AddTeamTaskBottomSheetProvider } from "./add-team-task-context";
import { JoinTeamBottomSheetProvider } from "./join-team-contex";
import { TaskFormBottomSheetProvider } from "./task-form-context";
import { CurrentTeamDataProvider } from "./team-data-context";

const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <CurrentTeamDataProvider>
      <TaskFormBottomSheetProvider>
        <AddTeamBottomSheetProvider>
          <AddTaskBottomSheetProvider>
            <JoinTeamBottomSheetProvider>
              <AddTeamTaskBottomSheetProvider>
                <AddTeamMemberBottomSheetProvider>
                  {children}
                </AddTeamMemberBottomSheetProvider>
              </AddTeamTaskBottomSheetProvider>
            </JoinTeamBottomSheetProvider>
          </AddTaskBottomSheetProvider>
        </AddTeamBottomSheetProvider>
      </TaskFormBottomSheetProvider>
    </CurrentTeamDataProvider>
  );
};

export default GlobalContextProvider;
