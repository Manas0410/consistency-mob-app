import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { View } from "@/components/ui/view";
import { useCurrentTeamData } from "@/contexts/team-data-context";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { useRouter } from "expo-router";
import { ClipboardList, MoveRight, Package, Users } from "lucide-react-native";
import React from "react";
import { Text } from "./text";

export function TeamCard({ teamData }: any) {
  const pallet = usePallet();
  const router = useRouter();
  const textColor = useColor({}, "text");

  const { setCurrentTeamData } = useCurrentTeamData();
  return (
    <Card
      style={{
        width: "100%",
        paddingBottom: 10,
      }}
    >
      <CardHeader>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: pallet.shade1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={Package} color="white" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <CardTitle
              style={{ fontSize: 18, fontWeight: "600", color: textColor }}
            >
              {teamData?.teamName}
            </CardTitle>
            {/* <CardDescription>2 minutes ago</CardDescription> */}
          </View>
        </View>
      </CardHeader>
      <CardContent
        style={{
          flexDirection: "row",
          gap: 16,
          marginTop: 6,
          marginBottom: 8,
          marginLeft: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon name={Users} color={pallet.shade2} size={18} />
          <Text style={{ color: textColor }}>
            {teamData?.members?.length ?? 0} Members
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon name={ClipboardList} color={pallet.shade2} size={18} />
          <Text style={{ color: textColor }}>
            {teamData?.tasks?.length ?? 0} Tasks
          </Text>
        </View>
      </CardContent>
      <Button
        style={{ width: "100%", height: 40 }}
        variant="secondary"
        icon={MoveRight}
        onPress={() => {
          setCurrentTeamData(teamData);
          router.push(`/${teamData?._id}/TeamDetails`);
        }}
      >
        View tasks
      </Button>
      {/* <CardFooter style={{ width: "100%" }}></CardFooter> */}
    </Card>
  );
}
