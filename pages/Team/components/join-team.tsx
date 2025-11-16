import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { View } from "@/components/ui/view";
import { useJoinTeamBottomSheet } from "@/contexts/join-team-contex";
import { usePallet } from "@/hooks/use-pallet";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { requestTojoin } from "../API/api-calls";

export function JoinTeam({
  toggleRerender,
}: {
  toggleRerender: (a: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [teamName, setTeamName] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  const { success, error, warning, info } = useToast();
  const { user } = useUser();
  const { close, isVisible } = useJoinTeamBottomSheet();
  const { teamid } = useLocalSearchParams();
  const pallet = usePallet();

  const handleTeamCreate = async () => {
    try {
      if (!teamName.trim()) {
        setShowError(true);
        return;
      }
      setLoading(true);
      let res = await requestTojoin({
        userName: user?.username,
        mail: "user@mail.com",
        // mail: user?.email,
        teamId: teamName,
      });
      if (res.success) {
        success("Request successfully sent");
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

  const inpError = showError && !teamName ? "enter team code" : "";

  return (
    <View>
      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        snapPoints={[0.4, 0.6, 0.9]}
      >
        <View style={{ gap: 16 }}>
          <Text variant="title">Join Team</Text>
          <Text variant="caption">Enter Team Code</Text>
          <Input
            variant="outline"
            placeholder={"Team Code"}
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
            Join Team
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
