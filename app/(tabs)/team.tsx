import { Text } from "@/components/ui/text"
import { View } from "@/components/ui/view"
import TeamsListing from "@/pages/Team/Teams-listpage"

const Team = () => {
    return (
        <View>

            <Text variant={"title"} >Teams</Text>
            <TeamsListing />
        </View>
    )
}