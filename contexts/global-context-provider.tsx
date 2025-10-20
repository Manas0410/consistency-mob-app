import { ReactNode } from "react";
import { AddTeamBottomSheetProvider } from "./add-team-context";
import { JoinTeamBottomSheetProvider } from "./join-team-contex";
import { TaskFormBottomSheetProvider } from "./task-form-context";
import { CurrentTeamDataProvider } from "./team-data-context";

const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <CurrentTeamDataProvider>
      <TaskFormBottomSheetProvider>
        <AddTeamBottomSheetProvider>
          <JoinTeamBottomSheetProvider>{children}</JoinTeamBottomSheetProvider>
        </AddTeamBottomSheetProvider>
      </TaskFormBottomSheetProvider>
    </CurrentTeamDataProvider>
  );
};

export default GlobalContextProvider;
