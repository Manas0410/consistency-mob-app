import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Calendar,
  ChevronRight,
  Plus,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackHeader from "@/components/ui/back-header";
import { Input } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { useAddTeamMemberBottomSheet } from "@/contexts/add-team-member-context";
import { useCurrentTeamData } from "@/contexts/team-data-context";
import { usePallet } from "@/hooks/use-pallet";
import { useUser } from "@clerk/clerk-expo";

import { getAllTeams } from "./API/api-calls";
import { AddTeamMember } from "./components/add-member";

/* -------------------------- TeamCard (child) ------------------------- */
/* Hooks are fine inside this component because it's a proper React component. */
const TeamCard: React.FC<{
  item: any;
  onPressCard: (item: any) => void;
  onOpenAdd: (teamId: string) => void;
}> = ({ item, onPressCard, onOpenAdd }) => {
  const pallet = usePallet();

  return (
    <View style={styles.teamCard}>
      <TouchableOpacity
        onPress={() => onPressCard(item)}
        activeOpacity={0.7}
        style={{ flex: 1 }}
      >
        <View style={styles.teamCardHeader}>
          <View style={styles.teamIconContainer}>
            <Text style={styles.teamIcon}>
              {(item?.teamName ?? "?").charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item?.teamName}</Text>
            <Text style={styles.teamDate}>
              Created{" "}
              {item?.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "-"}
            </Text>
          </View>
          <ChevronRight size={20} color="#CBD5E1" />
        </View>

        <View style={styles.teamStats}>
          <View style={styles.statItem}>
            <Users size={16} color="#6B7280" />
            <Text style={styles.statText}>
              {item?.members?.length || 0} member
              {(item?.members?.length || 0) !== 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.statText}>
              {item?.tasks?.length || 0} task
              {(item?.tasks?.length || 0) !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        <View style={styles.memberAvatars}>
          {item?.members?.slice(0, 4).map((member: any, index: number) => (
            <View
              key={member?.userId ?? index}
              style={[styles.memberAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
            >
              <Text style={styles.memberAvatarText}>
                {(member?.userName ?? "?").charAt(0).toUpperCase()}
              </Text>
            </View>
          ))}
          {(item?.members?.length || 0) > 4 && (
            <View
              style={[
                styles.memberAvatar,
                styles.moreMembers,
                { marginLeft: -8 },
              ]}
            >
              <Text style={styles.moreMembersText}>
                +{(item?.members?.length || 0) - 4}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() => onOpenAdd(item?._id)}
          style={{
            backgroundColor: pallet.buttonBg,
            width: 150,
            borderRadius: 8,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Plus color={pallet.shade1} />
          <Text style={{ color: pallet.ButtonText, fontSize: 12 }}>
            Add member
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ----------------------- TeamsHeader (memoized) ----------------------- */
const TeamsHeader = React.memo(function TeamsHeader({
  Teams,
  searchQuery,
  setSearchQuery,
  searching,
  totals,
}: {
  Teams: any[];
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  searching: boolean;
  totals: {
    totalTasks: number;
    assignedToMe: number;
    completedByMe: number;
    remainingForMe: number;
  };
}) {
  const pallet = usePallet();
  const { totalTasks = 0, assignedToMe = 0, completedByMe = 0 } = totals ?? {};
  const assignedFraction =
    totalTasks > 0 ? `${assignedToMe}/${totalTasks}` : String(assignedToMe);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeSubtext}>Manage your teams and task</Text>
      </View>

      <ScrollView
        horizontal
        style={styles.statsContainer}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Users size={20} color="#3B82F6" />
          </View>
          <Text style={styles.statNumber}>{Teams.length}</Text>
          <Text style={styles.statLabel}>Teams</Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[styles.statIconContainer, { backgroundColor: "#F0FDF4" }]}
          >
            <TrendingUp size={20} color="#F59E0B" />
          </View>
          <Text style={styles.statNumber}>{assignedFraction}</Text>
          <Text style={styles.statLabel}>Tasks Assigned</Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[styles.statIconContainer, { backgroundColor: "#EFF6FF" }]}
          >
            <TrendingUp size={20} color="#10B981" />
          </View>
          <Text style={styles.statNumber}>{completedByMe}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Teams</Text>
        <Text style={styles.sectionSubtitle}>
          {Teams.length} teams available
        </Text>
      </View>

      <Input
        icon={Search}
        rightComponent={
          searchQuery ? (
            searching ? (
              <Spinner variant="circle" size="sm" color={pallet.shade1} />
            ) : (
              <X onPress={() => setSearchQuery("")} />
            )
          ) : null
        }
        variant="outline"
        containerStyle={{
          flex: 1,
          borderRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search Teams"
      />
    </View>
  );
});

/* ------------------------ Main TeamsListing --------------------------- */
const TeamsListing: React.FC<{ rerender?: any }> = ({ rerender }) => {
  const router = useRouter();
  const pallet = usePallet();
  const { setCurrentTeamData } = useCurrentTeamData();
  const { user } = useUser();
  const userId = user?.id;

  const [Teams, setTeams] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { open } = useAddTeamMemberBottomSheet();

  const fetchTeams = useCallback(async (q: string) => {
    try {
      const res = await getAllTeams(q);
      if (res?.success) {
        setTeams(res.data ?? []);
      } else {
        setTeams([]);
      }
    } catch (err) {
      console.error("fetchTeams error", err);
      setTeams([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await fetchTeams("");
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [fetchTeams]);

  useEffect(() => {
    if (rerender) {
      fetchTeams(searchQuery);
    }
  }, [rerender, fetchTeams, searchQuery]);

  useEffect(() => {
    setSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await fetchTeams(searchQuery);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, fetchTeams]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTeams(searchQuery);
    } finally {
      setRefreshing(false);
    }
  }, [fetchTeams, searchQuery]);

  // totals for header
  const { totalTasks, assignedToMe, completedByMe, remainingForMe } =
    useMemo(() => {
      let totalTasks = 0;
      let assignedToMe = 0;
      let completedByMe = 0;

      for (const team of Teams ?? []) {
        const tasks = team?.tasks ?? [];
        totalTasks += tasks.length;

        for (const t of tasks) {
          const mine = (t?.assignees ?? []).some(
            (a: any) => a.userId === userId
          );
          if (mine) {
            assignedToMe += 1;
            if (t?.isDone) completedByMe += 1;
          }
        }
      }

      return {
        totalTasks,
        assignedToMe,
        completedByMe,
        remainingForMe: Math.max(0, assignedToMe - completedByMe),
      };
    }, [Teams, userId]);

  const headerEl = useMemo(
    () => (
      <TeamsHeader
        Teams={Teams}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searching={searching}
        totals={{ totalTasks, assignedToMe, completedByMe, remainingForMe }}
      />
    ),
    [
      Teams,
      searchQuery,
      searching,
      totalTasks,
      assignedToMe,
      completedByMe,
      remainingForMe,
    ]
  );

  const handleOpenAdd = (teamId: string) => {
    setSelectedTeamId(teamId);
    open(); // opens bottom sheet; AddTeamMember must read teamid prop or context accordingly
  };

  const handlePressCard = (item: any) => {
    setCurrentTeamData(item);
    router.push(`/${item?._id}/TeamDetails`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <Users size={48} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyStateTitle}>No teams yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Create your first team to start collaborating with others
      </Text>

      <View style={{ marginTop: 12 }}>
        <Text style={styles.emptyStateButtonText}>Create Your First Team</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <BackHeader title="Teams" />

      {/* single AddTeamMember instance at parent-level (pass selectedTeamId) */}
      <AddTeamMember teamid={selectedTeamId} />

      <View style={{ flex: 1 }}>
        <FlatList
          style={styles.listContainer}
          data={Teams}
          keyExtractor={(item: any) => String(item?._id)}
          renderItem={({ item }) => (
            <TeamCard
              item={item}
              onPressCard={handlePressCard}
              onOpenAdd={handleOpenAdd}
            />
          )}
          ListHeaderComponent={headerEl}
          ListEmptyComponent={!initialLoading ? renderEmptyState : null}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          contentContainerStyle={[
            styles.listContent,
            Teams.length === 0 && !initialLoading && { flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
        />

        {initialLoading && (
          <View style={styles.initialOverlay}>
            <Spinner variant="bars" size="default" color={pallet.shade1} />
            <Text>Loading your teams...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },

  headerContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginBottom: 8,
  },
  welcomeSection: { marginTop: 16, marginBottom: 24 },
  welcomeSubtext: { fontSize: 16, color: "#64748B", fontWeight: "500" },

  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    display: "flex",
  },
  statCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
    width: 130,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  sectionHeader: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  sectionSubtitle: { fontSize: 14, color: "#64748B", fontWeight: "500" },

  listContainer: { flex: 1, backgroundColor: "#F8FAFC" },
  listContent: { paddingBottom: 220 },
  itemSeparator: { height: 16 },

  teamCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 0,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: "hidden",
  },
  teamCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 8,
  },
  teamIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  teamIcon: { color: "#fff", fontSize: 20, fontWeight: "700" },
  teamInfo: { flex: 1 },
  teamName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  teamDate: { fontSize: 14, color: "#64748B", fontWeight: "500" },
  teamStats: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  memberAvatars: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  memberAvatarText: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  moreMembers: { backgroundColor: "#F1F5F9" },
  moreMembersText: { fontSize: 10, fontWeight: "600", color: "#6B7280" },

  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#3B82F6",
  },

  initialOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(248,250,252,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TeamsListing;
