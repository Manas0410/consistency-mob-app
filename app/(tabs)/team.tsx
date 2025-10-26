import CategoryClock from "@/components/category-clock";
import { View } from "@/components/ui/view";
// import { AddTeam } from "@/pages/Team/components/create-team";
// import { JoinTeam } from "@/pages/Team/components/join-team";
// import TeamsListing from "@/pages/Team/Teams-listpage";
import { useState } from "react";

const Team = () => {
  // return <TeamDashboard/>
  const [rerender, toggleRerender] = useState<boolean>(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {/* <TeamsListing rerender={rerender} />
      <AddTeam toggleRerender={toggleRerender} />
      <JoinTeam toggleRerender={toggleRerender} /> */}
      <CategoryClock />
    </View>
  );
};

export default Team;
