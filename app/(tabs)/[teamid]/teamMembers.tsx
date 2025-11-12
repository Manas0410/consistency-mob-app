import BackHeader from "@/components/ui/back-header";
import { Spinner } from "@/components/ui/spinner";
import { useAddTeamMemberBottomSheet } from "@/contexts/add-team-member-context";
import { useCurrentTeamData } from "@/contexts/team-data-context";
import { usePallet } from "@/hooks/use-pallet";
import { getTeamMembers } from "@/pages/Team/API/api-calls";
import { AddTeamMember } from "@/pages/Team/components/add-member";
import { JoinRequests } from "@/pages/Team/components/join-requests";
import { TeamMembersList } from "@/pages/Team/components/member-list";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Crown, User, UserPlus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TeamManagement() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Crown size={16} color="#f59e0b" />;
      case "member":
        return <User size={16} color="#6b7280" />;
      default:
        return <User size={16} color="#6b7280" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "#f59e0b";
      case "member":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState();
  const { teamid } = useLocalSearchParams();
  const user = useUser();

  const { currentTeamData } = useCurrentTeamData();

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const res = await getTeamMembers(teamid);
      if (res.success) {
        setMembers(res.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user.user?.id) return;

    // priority: use currentTeamData.members if available, else fallback to fetched list
    const allMembers = currentTeamData?.members?.length
      ? currentTeamData.members
      : members;

    const currentMember = allMembers?.find(
      (m: any) => m.userId === user.user?.id
    );

    setIsAdmin(currentMember?.role === "admin");
  }, [user.user?.id, currentTeamData?.members, members]);

  useEffect(() => {
    fetchMembers();
  }, [teamid]);

  const pallet = usePallet();
  const { open } = useAddTeamMemberBottomSheet();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner variant="bars" size="default" color={pallet.shade1} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar style="dark" />
      <AddTeamMember />
      <BackHeader title={currentTeamData?.teamName ?? "Team"} />

      {/* Header (same as before) */}
      {/* ...team stats cards... (same as before) */}

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        {/* Team Stats Cards here (same as your code) */}

        {/* Join Requests */}
        {isAdmin && (
          <JoinRequests joinRequests={currentTeamData.joinRequests} />
        )}
        {/* Team Members List */}
        <TeamMembersList
          users={members}
          getRoleIcon={getRoleIcon}
          getRoleColor={getRoleColor}
          isAdmin={isAdmin}
        />

        {/* Invite New Member Button */}
        <View style={{ margin: 20 }}>
          <TouchableOpacity
            onPress={() => {
              open();
            }}
            style={{
              backgroundColor: "#3b82f6",
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 100,
            }}
          >
            <UserPlus size={20} color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              Invite New Member
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
