import { ReactNode } from "react";
import { AddTaskBottomSheetProvider } from "./add-task-context";
import { AddTeamBottomSheetProvider } from "./add-team-context";
import { AddTeamMemberBottomSheetProvider } from "./add-team-member-context";
import { AddTeamTaskBottomSheetProvider } from "./add-team-task-context";
import { FocusProvider } from "./focus-context";
import { JoinTeamBottomSheetProvider } from "./join-team-contex";
import { LocalUserProvider } from "./local-user-info";
import { SelectModeBottomSheetProvider } from "./select-mode-context";
import { ViewTaskProvider } from "./selected-view-task-context";
import { TaskFormBottomSheetProvider } from "./task-form-context";
import { CurrentTeamDataProvider } from "./team-data-context";
import { CurrentDayTaskProvider } from "./todays-tasks-context";

const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LocalUserProvider>
      <CurrentTeamDataProvider>
        <CurrentDayTaskProvider>
          <ViewTaskProvider>
            <TaskFormBottomSheetProvider>
              <AddTeamBottomSheetProvider>
                <AddTaskBottomSheetProvider>
                  <JoinTeamBottomSheetProvider>
                    <AddTeamTaskBottomSheetProvider>
                      <SelectModeBottomSheetProvider>
                        <AddTeamMemberBottomSheetProvider>
                          <FocusProvider>{children}</FocusProvider>
                        </AddTeamMemberBottomSheetProvider>
                      </SelectModeBottomSheetProvider>
                    </AddTeamTaskBottomSheetProvider>
                  </JoinTeamBottomSheetProvider>
                </AddTaskBottomSheetProvider>
              </AddTeamBottomSheetProvider>
            </TaskFormBottomSheetProvider>
          </ViewTaskProvider>
        </CurrentDayTaskProvider>
      </CurrentTeamDataProvider>
    </LocalUserProvider>
  );
};

export default GlobalContextProvider;
