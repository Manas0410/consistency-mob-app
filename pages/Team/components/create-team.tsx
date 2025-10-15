import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { View } from "@/components/ui/view";
import { Plus, Users } from "lucide-react-native";
import React from "react";
import { createTeam } from "../API/api-calls";

export function AddTeam({
  isVisible,
  close,
  toggleRerender,
}: {
  isVisible: boolean;
  close: () => void;
  toggleRerender: (a: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [teamName, setTeamName] = React.useState("");

  const { success, error, warning, info } = useToast();

  const handleTeamCreate = async () => {
    try {
      if (!teamName) return;
      setLoading(true);
      let res = await createTeam(teamName);
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
            label={"Team Name"}
            placeholder={"Enter Team Name"}
            icon={Users}
            value={teamName}
            onChangeText={setTeamName}
          />
          <Button
            loading={loading}
            icon={Plus}
            variant="success"
            onPress={handleTeamCreate}
          >
            Create
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
