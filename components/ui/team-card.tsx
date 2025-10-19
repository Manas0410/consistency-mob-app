import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { View } from "@/components/ui/view";
import { usePallet } from "@/hooks/use-pallet";
import { useRouter } from "expo-router";
import { ClipboardList, MoveRight, Package, Users } from "lucide-react-native";
import React from "react";
import { Text } from "./text";

type Props = {
  teamName: string;
  noOfMembers: number;
  noOfTasks: number;
};

export function TeamCard({ teamName, noOfMembers, noOfTasks }: Props) {
  const pallet = usePallet();
  const router = useRouter();

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
              backgroundColor: "#3b82f6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={Package} color="white" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <CardTitle style={{ fontSize: 18, fontWeight: "600" }}>
              {teamName}
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
          <Text>{noOfMembers ?? 0} Members</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon name={ClipboardList} color={pallet.shade2} size={18} />
          <Text>{noOfTasks ?? 0} Tasks</Text>
        </View>
      </CardContent>
      <Button
        style={{ width: "100%", height: 40 }}
        variant="secondary"
        icon={MoveRight}
        onPress={() => router.push(`/TeamDetails`)}
      >
        View tasks
      </Button>
      {/* <CardFooter style={{ width: "100%" }}></CardFooter> */}
    </Card>
  );
}
