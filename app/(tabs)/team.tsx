import { useBottomSheet } from "@/components/ui/bottom-sheet";
import { View } from "@/components/ui/view";
import { AddTeam } from "@/pages/Team/components/create-team";
import TeamsListing from "@/pages/Team/Teams-listpage";

const Team = () => {
    // return <TeamDashboard/>
    const { isVisible, open, close } = useBottomSheet();
    
    return (
        <View style={{ flex: 1 }}>
            <TeamsListing open={open} />
            <AddTeam isVisible={isVisible} close={close} />
        </View>
    )
}

export default Team