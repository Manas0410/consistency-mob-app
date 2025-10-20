import { ReactNode } from "react";
import { AddTeamBottomSheetProvider } from "./add-team-context";
import { JoinTeamBottomSheetProvider } from "./join-team-contex";
import { TaskFormBottomSheetProvider } from "./task-form-context";

const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TaskFormBottomSheetProvider>
      <AddTeamBottomSheetProvider>
        <JoinTeamBottomSheetProvider>{children}</JoinTeamBottomSheetProvider>
      </AddTeamBottomSheetProvider>
    </TaskFormBottomSheetProvider>
  );
};

export default GlobalContextProvider;
