import { View } from "@/components/ui/view"
import TeamDashboard from "@/pages/Team/team-dashboard"
import TeamsListing from "@/pages/Team/Teams-listpage"

const Team = () => {
    return <TeamDashboard/>
    return (
        <View style={{ flex: 1 }}>
            <TeamsListing />
            <TeamDashboard/>
        </View>
    )
}

export default Team