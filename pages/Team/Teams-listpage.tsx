import BackHeader from "@/components/ui/back-header";
import { Input } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view"; // horizontal only
import { Spinner } from "@/components/ui/spinner";
import { useCurrentTeamData } from "@/contexts/team-data-context";
import { usePallet } from "@/hooks/use-pallet";
import { useUser } from "@clerk/clerk-expo";
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
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllTeams } from "./API/api-calls";

// ---------- Header (memoized element so it doesn't remount) ----------
const TeamsHeader = React.memo(function TeamsHeader({
  Teams,
  searchQuery,
  setSearchQuery,
  searching,
}: {
  Teams: any[];
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  searching: boolean;
}) {
  const pallet = usePallet();
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
          <Text style={styles.statNumber}>—</Text>
          <Text style={styles.statLabel}>Tasks Assigned</Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[styles.statIconContainer, { backgroundColor: "#EFF6FF" }]}
          >
            <TrendingUp size={20} color="#10B981" />
          </View>
          <Text style={styles.statNumber}>—</Text>
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

// ---------------- Main Screen ----------------
const TeamsListing = ({ rerender }: { rerender?: any }) => {
  const router = useRouter();
  const pallet = usePallet();
  const { setCurrentTeamData } = useCurrentTeamData();
  const { user } = useUser();
  const userId = user?.id;

  const [Teams, setTeams] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true); // only for first load
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false); // light inline indicator

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTeams = async (q: string) => {
    const res = await getAllTeams(q);
    if (res?.success) {
      // @ts-ignore
      setTeams(res.data ?? []);
    } else {
      setTeams([]);
    }
  };

  // Initial load (once)
  useEffect(() => {
    (async () => {
      try {
        await fetchTeams("");
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  // Rerender trigger (does not flip initial loader)
  useEffect(() => {
    if (rerender) fetchTeams(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender]);

  // Debounced search without full-screen loader
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTeams(searchQuery);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderTeamCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.teamCard}
      onPress={() => {
        setCurrentTeamData(item);
        router.push(`/${item?._id}/TeamDetails` as any);
      }}
      activeOpacity={0.7}
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
            Created {formatDate(item?.createdAt)}
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
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <Users size={48} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyStateTitle}>No teams yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Create your first team to start collaborating with others
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() =>
          Alert.alert("Create Team", "Team creation feature coming soon!")
        }
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.emptyStateButtonText}>Create Your First Team</Text>
      </TouchableOpacity>
    </View>
  );

  const headerEl = useMemo(
    () => (
      <TeamsHeader
        Teams={Teams}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searching={searching}
      />
    ),
    [Teams, searchQuery, searching]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <BackHeader title="Teams" />

      {/* Always render the list; show initial loader as overlay only */}
      <View style={{ flex: 1 }}>
        <FlatList
          style={styles.listContainer}
          data={Teams}
          keyExtractor={(item: any) => String(item?._id)}
          renderItem={renderTeamCard}
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
            <Text style={{}}>Loading your teams...</Text>
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
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    marginHorizontal: 20,
    marginBottom: 0,
  },
  teamCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  teamStats: { flexDirection: "row", gap: 20, marginBottom: 16 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  memberAvatars: { flexDirection: "row", alignItems: "center" },
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
  emptyStateButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Initial overlay loader (only first load)
  initialOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(248,250,252,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TeamsListing;
