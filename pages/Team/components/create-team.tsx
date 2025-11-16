import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { View } from "@/components/ui/view";
import { useAddTeamBottomSheet } from "@/contexts/add-team-context";
import { usePallet } from "@/hooks/use-pallet";
import { useUser } from "@clerk/clerk-expo";
import { Plus, Users } from "lucide-react-native";
import React from "react";
import { createTeam } from "../API/api-calls";

export function AddTeam({
  toggleRerender,
}: {
  toggleRerender: (a: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [teamName, setTeamName] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  const { success, error, warning, info } = useToast();
  const { user } = useUser();
  const pallet = usePallet();
  const { close, isVisible } = useAddTeamBottomSheet();

  const handleTeamCreate = async () => {
    try {
      if (!teamName.trim()) {
        setShowError(true);
        return;
      }
      setLoading(true);
      let res = await createTeam(teamName, user?.username, user?.email);
      if (res.success) {
        success("Team Created", "Team created successfully");
        setTeamName("");
        toggleRerender((p: boolean) => !p);
        close();
      } else {
        error("Error", "Failed to create team");
      }
    } catch (err) {
      error("Error", "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const inpError = showError && !teamName ? "enter team name" : "";

  return (
    <View>
      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        snapPoints={[0.3, 0.6, 0.9]}
      >
        <View style={{ gap: 16 }}>
          <Text variant="title">Create new team</Text>
          <Input
            variant="outline"
            label={"Team Name"}
            placeholder={"Enter Team Name"}
            icon={Users}
            value={teamName}
            onChangeText={setTeamName}
            labelStyle={{ fontSize: 13 }}
            error={inpError}
          />
          <Button
            loading={loading}
            icon={Plus}
            variant="success"
            style={{ marginTop: 16, backgroundColor: pallet.shade1 }}
            textStyle={{ color: "#fff" }}
            onPress={handleTeamCreate}
          >
            Create
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
