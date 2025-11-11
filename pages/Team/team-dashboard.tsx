import BackHeader from "@/components/ui/back-header";
import { Button } from "@/components/ui/button";
import AnimatedProgressRing from "@/components/ui/progress-ring";
import { ScrollView } from "@/components/ui/scroll-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useCurrentTeamData } from "@/contexts/team-data-context";
import { usePallet } from "@/hooks/use-pallet";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, LogOut, Trash2, Users } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DeleteTeam, exitTeam } from "./API/api-calls";

function TeamDashboard() {
  const { teamid } = useLocalSearchParams();
  const router = useRouter();
  const { currentTeamData } = useCurrentTeamData();
  const { user } = useUser();
  const userId = user?.id ?? "";

  const pallet = usePallet();
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ---- Helpers -------------------------------------------------------------
  const pct = (num: number, den: number) =>
    den > 0 ? Math.round((num / den) * 100) : 0;

  const tasks = useMemo(() => currentTeamData?.tasks ?? [], [currentTeamData]);
  const members = useMemo(
    () => currentTeamData?.members ?? [],
    [currentTeamData]
  );

  // Admin check (delete button gate)
  const isAdmin = useMemo(
    () => members.some((m: any) => m.userId === userId && m.role === "admin"),
    [members, userId]
  );

  // ---- TEAM totals ---------------------------------------------------------
  const totalCount = tasks.length;
  const teamCompletedCount = tasks.filter((t: any) => t.isDone).length;
  const teamRemainingCount = totalCount - teamCompletedCount;
  const teamCompletionPct = pct(teamCompletedCount, totalCount);

  // ---- ME (current user) stats --------------------------------------------
  const myAssigned = tasks.filter((t: any) =>
    (t.assignees ?? []).some((a: any) => a.userId === userId)
  );
  const myAssignedCount = myAssigned.length;
  const myCompletedCount = myAssigned.filter((t: any) => t.isDone).length;
  const myRemainingCount = myAssignedCount - myCompletedCount;
  const myCompletionPct = pct(myCompletedCount, myAssignedCount);

  const teamStats = [
    { label: "Completed", value: teamCompletedCount, color: "#17c964" },
    { label: "Remaining", value: teamRemainingCount, color: "#F87171" },
    { label: "Assigned", value: totalCount, color: "#4299e1" }, // total team tasks
  ];

  const myStats = [
    { label: "Completed", value: myCompletedCount, color: "#17c964" },
    { label: "Remaining", value: myRemainingCount, color: "#F87171" },
    { label: "Assigned", value: myAssignedCount, color: "#4299e1" },
  ];

  // ---- Delete team ---------------------------------------------------------
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const del = await DeleteTeam(teamid);
      if (del?.success) router.replace("/team");
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView>
        <BackHeader title={currentTeamData?.teamName ?? "Team"} />

        <ScrollView>
          <View style={styles.card}>
            <Text
              variant="heading"
              style={{ textAlign: "center", color: pallet.shade1 }}
            >
              Team Stats
            </Text>

            <View
              style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}
            >
              <Text style={styles.count}>{totalCount}</Text>
              <Text variant="caption">Tasks</Text>
            </View>

            <Text style={styles.monthProgress}>
              Task Completion{" "}
              <Text style={{ color: "#17c964", fontWeight: "bold" }}>
                {teamCompletionPct}%
              </Text>
            </Text>

            <Tabs defaultValue="team">
              <TabsList
                style={{
                  width: 180,
                  borderRadius: 10,
                  margin: "auto",
                  height: 40,
                }}
              >
                <TabsTrigger style={{ borderRadius: 200 }} value="team">
                  <Text>Team</Text>
                </TabsTrigger>
                <TabsTrigger style={{ borderRadius: 20 }} value="me">
                  <Text>Me</Text>
                </TabsTrigger>
              </TabsList>

              {/* TEAM TAB */}
              <TabsContent value="team" style={{ width: "100%" }}>
                <View style={{ alignItems: "center", gap: 16 }}>
                  <AnimatedProgressRing percentage={teamCompletionPct} />
                  <View style={styles.statsRow}>
                    {teamStats.map((s) => (
                      <View key={s.label} style={styles.statBox}>
                        <Text style={[styles.statValue, { color: s.color }]}>
                          {s.value}
                        </Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TabsContent>

              {/* ME TAB */}
              <TabsContent value="me" style={{ width: "100%" }}>
                <View
                  style={{
                    paddingHorizontal: 16,
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <AnimatedProgressRing percentage={myCompletionPct} />
                  <View style={styles.statsRow}>
                    {myStats.map((s) => (
                      <View key={s.label} style={styles.statBox}>
                        <Text style={[styles.statValue, { color: s.color }]}>
                          {s.value}
                        </Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TabsContent>
            </Tabs>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <Button
              variant="default"
              style={{ borderRadius: 12, backgroundColor: pallet.buttonBg }}
              textStyle={{ color: pallet.ButtonText }}
              icon={Calendar}
              onPress={() => router.replace(`/${teamid}/teamTaskPage`)}
              disabled={deleteLoading}
            >
              View Tasks
            </Button>

            <Button
              variant="default"
              style={{ borderRadius: 12, backgroundColor: pallet.buttonBg }}
              textStyle={{ color: pallet.ButtonText }}
              icon={Users}
              onPress={() => router.replace(`/${teamid}/teamMembers`)}
              disabled={deleteLoading}
            >
              Manage Members
            </Button>

            <Button
              variant="destructive"
              style={{ borderRadius: 12, backgroundColor: pallet.errorBg }}
              textStyle={{ color: pallet.errorText }}
              icon={LogOut}
              onPress={() => {
                Alert.alert(
                  "Confirm Exit",
                  "Are you sure you want to exit the team?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Exit",
                      style: "destructive",
                      onPress: () => exitTeam(teamid),
                    },
                  ],
                  { cancelable: false }
                );
              }}
              disabled={deleteLoading}
            >
              Exit Team
            </Button>

            {isAdmin && (
              <Button
                variant="destructive"
                style={{ borderRadius: 12, backgroundColor: pallet.errorBg }}
                textStyle={{ color: pallet.errorText }}
                icon={Trash2}
                onPress={() => {
                  Alert.alert(
                    "Confirm Delete",
                    "Are you sure you want to delete the team?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: handleDelete,
                      },
                    ],
                    { cancelable: false }
                  );
                }}
                loading={deleteLoading}
                disabled={deleteLoading}
              >
                Delete Team
              </Button>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    gap: 2,
  },
  count: { fontSize: 32, fontWeight: "700", color: "#222", marginBottom: 4 },
  monthProgress: { color: "#7a7a7a", fontSize: 14, marginBottom: 18 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  statBox: { alignItems: "center", flex: 1 },
  statLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 2,
    fontWeight: "600",
  },
  statValue: { fontSize: 16, fontWeight: "700", color: "#222" },
  actionRow: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 4,
    overflow: "hidden",
    gap: 8,
    marginBottom: 350,
    padding: 20,
  },
});

export default TeamDashboard;
