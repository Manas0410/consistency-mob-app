import { useBottomSheet } from "@/components/ui/bottom-sheet";
import { View } from "@/components/ui/view";
import { AddTeam } from "@/pages/Team/components/create-team";
import TeamsListing from "@/pages/Team/Teams-listpage";
import { useState } from "react";

const Team = () => {
  // return <TeamDashboard/>
  const { isVisible, open, close } = useBottomSheet();
  const [rerender, toggleRerender] = useState<boolean>(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <TeamsListing open={open} rerender={rerender} />
      <AddTeam
        isVisible={isVisible}
        close={close}
        toggleRerender={toggleRerender}
      />
    </View>
  );
};

export default Team;
