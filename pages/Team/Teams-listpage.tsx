import BackHeader from "@/components/ui/back-header";
import { Spinner } from "@/components/ui/spinner";
import { TeamCard } from "@/components/ui/team-card";
import { usePallet } from "@/hooks/use-pallet";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllTeams } from "./API/api-calls";

const TeamsListing = ({ rerender }: { rerender: boolean }) => {
  const router = useRouter();

  const [Teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const response = await getAllTeams();
      if (response.success) {
        // @ts-ignore
        setTeams(response.data);
      } else {
        setTeams([]);
      }
    } catch (e) {
      console.log(e);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [rerender]);

  const pallet = usePallet();
  return (
    <SafeAreaView style={styles.safeArea}>
      <BackHeader title="Teams"></BackHeader>

      {loading ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner variant="bars" size="default" color={pallet.shade1} />
        </View>
      ) : (
        <FlatList
          style={{ backgroundColor: "#faf7f7ff" }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          data={Teams}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <TeamCard teamData={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", paddingBottom: 50 },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  iconButton: { padding: 6 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  listContent: {
    padding: 12,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: "hidden",
  },
});

export default TeamsListing;

// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   RefreshControl,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
// import {
//   Users,
//   Plus,
//   Search,
//   TrendingUp,
//   Calendar,
//   Clock,
//   ChevronRight,
//   Settings,
// } from "lucide-react-native";

// const TeamsListing = ({ rerender }) => {
//   const router = useRouter();

//   const [Teams, setTeams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // Mock API call - replace with your actual API
//   const fetchTeams = async () => {
//     try {
//       // Replace this with your actual getAllTeams API call
//       const mockResponse = {
//         success: true,
//         data: [
//           {
//             _id: "68efbf300a6dc199842a9a8d",
//             teamName: "Design Team",
//             members: [
//               { userId: "user_1", userName: "John Doe", role: "admin" },
//               { userId: "user_2", userName: "Jane Smith", role: "member" },
//             ],
//             tasks: [],
//             createdAt: "2025-10-15T15:35:12.938Z",
//           },
//           {
//             _id: "68efbf3a0a6dc199842a9a8f",
//             teamName: "Development Team",
//             members: [
//               { userId: "user_3", userName: "Mike Johnson", role: "admin" },
//               { userId: "user_4", userName: "Sarah Wilson", role: "member" },
//               { userId: "user_5", userName: "Tom Brown", role: "member" },
//             ],
//             tasks: [],
//             createdAt: "2025-10-15T15:35:22.610Z",
//           },
//         ],
//       };

//       setTimeout(() => {
//         if (mockResponse.success) {
//           setTeams(mockResponse.data);
//         } else {
//           setTeams([]);
//         }
//         setLoading(false);
//       }, 1000);
//     } catch (e) {
//       console.log(e);
//       setTeams([]);
//       setLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchTeams();
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     fetchTeams();
//   }, [rerender]);

//   const getTotalMembers = () => {
//     return Teams.reduce(
//       (total, team) => total + (team.members?.length || 0),
//       0
//     );
//   };

//   const getTotalTasks = () => {
//     return Teams.reduce((total, team) => total + (team.tasks?.length || 0), 0);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const renderTeamCard = ({ item }) => (
//     <TouchableOpacity
//       style={styles.teamCard}
//       onPress={() => router.push("/team")}
//       activeOpacity={0.7}
//     >
//       <View style={styles.teamCardHeader}>
//         <View style={styles.teamIconContainer}>
//           <Text style={styles.teamIcon}>
//             {item.teamName.charAt(0).toUpperCase()}
//           </Text>
//         </View>
//         <View style={styles.teamInfo}>
//           <Text style={styles.teamName}>{item.teamName}</Text>
//           <Text style={styles.teamDate}>
//             Created {formatDate(item.createdAt)}
//           </Text>
//         </View>
//         <ChevronRight size={20} color="#CBD5E1" />
//       </View>

//       <View style={styles.teamStats}>
//         <View style={styles.statItem}>
//           <Users size={16} color="#6B7280" />
//           <Text style={styles.statText}>
//             {item.members?.length || 0} member
//             {(item.members?.length || 0) !== 1 ? "s" : ""}
//           </Text>
//         </View>
//         <View style={styles.statItem}>
//           <Calendar size={16} color="#6B7280" />
//           <Text style={styles.statText}>
//             {item.tasks?.length || 0} task
//             {(item.tasks?.length || 0) !== 1 ? "s" : ""}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.memberAvatars}>
//         {item.members?.slice(0, 4).map((member, index) => (
//           <View
//             key={member.userId}
//             style={[styles.memberAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
//           >
//             <Text style={styles.memberAvatarText}>
//               {member.userName.charAt(0).toUpperCase()}
//             </Text>
//           </View>
//         ))}
//         {(item.members?.length || 0) > 4 && (
//           <View
//             style={[
//               styles.memberAvatar,
//               styles.moreMembers,
//               { marginLeft: -8 },
//             ]}
//           >
//             <Text style={styles.moreMembersText}>
//               +{(item.members?.length || 0) - 4}
//             </Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   const renderHeader = () => (
//     <View style={styles.headerContainer}>
//       {/* Welcome Section */}
//       <View style={styles.welcomeSection}>
//         <Text style={styles.welcomeText}>Welcome back!</Text>
//         <Text style={styles.welcomeSubtext}>
//           Manage your teams and projects
//         </Text>
//       </View>

//       {/* Stats Cards */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statCard}>
//           <View style={styles.statIconContainer}>
//             <Users size={20} color="#3B82F6" />
//           </View>
//           <Text style={styles.statNumber}>{Teams.length}</Text>
//           <Text style={styles.statLabel}>Teams</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View
//             style={[styles.statIconContainer, { backgroundColor: "#EFF6FF" }]}
//           >
//             <Users size={20} color="#10B981" />
//           </View>
//           <Text style={styles.statNumber}>{getTotalMembers()}</Text>
//           <Text style={styles.statLabel}>Members</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View
//             style={[styles.statIconContainer, { backgroundColor: "#F0FDF4" }]}
//           >
//             <TrendingUp size={20} color="#F59E0B" />
//           </View>
//           <Text style={styles.statNumber}>{getTotalTasks()}</Text>
//           <Text style={styles.statLabel}>Tasks</Text>
//         </View>
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionButtonsContainer}>
//         <TouchableOpacity
//           style={styles.primaryButton}
//           onPress={() =>
//             Alert.alert("Create Team", "Team creation feature coming soon!")
//           }
//         >
//           <Plus size={20} color="#fff" />
//           <Text style={styles.primaryButtonText}>Create Team</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.secondaryButton}
//           onPress={() => Alert.alert("Search", "Search feature coming soon!")}
//         >
//           <Search size={20} color="#6B7280" />
//         </TouchableOpacity>
//       </View>

//       {/* Section Title */}
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Your Teams</Text>
//         <Text style={styles.sectionSubtitle}>
//           {Teams.length} teams available
//         </Text>
//       </View>
//     </View>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyStateContainer}>
//       <View style={styles.emptyStateIcon}>
//         <Users size={48} color="#D1D5DB" />
//       </View>
//       <Text style={styles.emptyStateTitle}>No teams yet</Text>
//       <Text style={styles.emptyStateSubtitle}>
//         Create your first team to start collaborating with others
//       </Text>
//       <TouchableOpacity
//         style={styles.emptyStateButton}
//         onPress={() =>
//           Alert.alert("Create Team", "Team creation feature coming soon!")
//         }
//       >
//         <Plus size={20} color="#fff" />
//         <Text style={styles.emptyStateButtonText}>Create Your First Team</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar style="dark" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Text style={styles.headerTitle}>Teams</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.headerButton}
//           onPress={() =>
//             Alert.alert("Settings", "Settings feature coming soon!")
//           }
//         >
//           <Settings size={24} color="#64748B" />
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <View style={styles.loadingContent}>
//             <ActivityIndicator size="large" color="#3B82F6" />
//             <Text style={styles.loadingText}>Loading your teams...</Text>
//           </View>
//         </View>
//       ) : (
//         <FlatList
//           style={styles.listContainer}
//           ListHeaderComponent={renderHeader}
//           ListEmptyComponent={renderEmptyState}
//           ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
//           data={Teams}
//           keyExtractor={(item) => item._id}
//           renderItem={renderTeamCard}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={["#3B82F6"]}
//               tintColor="#3B82F6"
//             />
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#1E293B",
//   },
//   headerButton: {
//     padding: 8,
//   },
//   headerContainer: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//     paddingBottom: 24,
//     marginBottom: 8,
//   },
//   welcomeSection: {
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   welcomeText: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#1E293B",
//     marginBottom: 4,
//   },
//   welcomeSubtext: {
//     fontSize: 16,
//     color: "#64748B",
//     fontWeight: "500",
//   },
//   statsContainer: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 24,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//     borderRadius: 16,
//     padding: 16,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   statIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#DBEAFE",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#1E293B",
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "#64748B",
//     fontWeight: "600",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   actionButtonsContainer: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 32,
//   },
//   primaryButton: {
//     flex: 1,
//     backgroundColor: "#3B82F6",
//     borderRadius: 12,
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#3B82F6",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   primaryButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
//   secondaryButton: {
//     width: 56,
//     height: 56,
//     backgroundColor: "#F1F5F9",
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   sectionHeader: {
//     marginBottom: 0,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#1E293B",
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: "#64748B",
//     fontWeight: "500",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC",
//   },
//   loadingContent: {
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: "#64748B",
//     fontWeight: "500",
//   },
//   listContainer: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },
//   listContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 32,
//   },
//   itemSeparator: {
//     height: 16,
//   },
//   teamCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 0,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     shadowColor: "#1E293B",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 1,
//   },
//   teamCardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   teamIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#3B82F6",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   },
//   teamIcon: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "700",
//   },
//   teamInfo: {
//     flex: 1,
//   },
//   teamName: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#1E293B",
//     marginBottom: 4,
//   },
//   teamDate: {
//     fontSize: 14,
//     color: "#64748B",
//     fontWeight: "500",
//   },
//   teamStats: {
//     flexDirection: "row",
//     gap: 20,
//     marginBottom: 16,
//   },
//   statItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   statText: {
//     fontSize: 14,
//     color: "#6B7280",
//     fontWeight: "500",
//   },
//   memberAvatars: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   memberAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#E2E8F0",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   memberAvatarText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#64748B",
//   },
//   moreMembers: {
//     backgroundColor: "#F1F5F9",
//   },
//   moreMembersText: {
//     fontSize: 10,
//     fontWeight: "600",
//     color: "#6B7280",
//   },
//   emptyStateContainer: {
//     alignItems: "center",
//     paddingVertical: 60,
//     paddingHorizontal: 40,
//   },
//   emptyStateIcon: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#F1F5F9",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   emptyStateTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#1E293B",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   emptyStateSubtitle: {
//     fontSize: 16,
//     color: "#64748B",
//     textAlign: "center",
//     lineHeight: 24,
//     marginBottom: 32,
//   },
//   emptyStateButton: {
//     backgroundColor: "#3B82F6",
//     borderRadius: 12,
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     flexDirection: "row",
//     alignItems: "center",
//     shadowColor: "#3B82F6",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   emptyStateButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
// });

// export default TeamsListing;
