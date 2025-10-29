// import { Text } from "@/components/ui/text";
// import { View } from "@/components/ui/view";
// import { getTeamMembers } from "@/pages/Team/API/api-calls";
// import { AddTeamMember } from "@/pages/Team/components/add-member";
// import { useLocalSearchParams } from "expo-router";
// import { User } from "lucide-react-native"; // Lucide icon
// import React, { useEffect, useState } from "react";
// import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function ManageMembers() {
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { teamid } = useLocalSearchParams();

//   const fetchMembers = async () => {
//     try {
//       setLoading(true);

//       const res = await getTeamMembers(teamid);
//       if (res.success) {
//         setMembers(res.data);
//       }
//     } catch (err) {
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMembers();
//   }, [teamid]);

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <User size={24} color="#333" />
//       <Text style={styles.userName}>{item.userName}</Text>
//       {/* <Text style={styles.mail}>{item.mail}</Text> */}
//     </View>
//   );

//   const renderAddCard = () => (
//     <TouchableOpacity style={styles.addCard} onPress={() => {}}>
//       <Text style={styles.addText}>+ Add Member</Text>
//     </TouchableOpacity>
//   );

//   //   alert("Add Member")
//   return (
//     <View style={styles.container}>
//       <SafeAreaView>
//         <Text variant="heading">Team Members </Text>
//         <FlatList
//           data={members}
//           keyExtractor={(item) => item.userId}
//           showsHorizontalScrollIndicator={false}
//           ListFooterComponent={renderAddCard}
//           renderItem={renderItem}
//           contentContainerStyle={{ paddingHorizontal: 20 }}
//         />
//         <AddTeamMember />
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingVertical: 20,
//     backgroundColor: "#fff", // Light mode background
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 15,
//     marginRight: 15,
//     alignItems: "center",
//     width: "auto",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 4,
//   },
//   userName: {
//     marginTop: 8,
//     fontWeight: "600",
//     fontSize: 16,
//     color: "#222",
//   },
//   mail: {
//     fontSize: 12,
//     color: "#666",
//     marginTop: 2,
//     textAlign: "center",
//   },
//   addCard: {
//     // width: 130,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderStyle: "dotted",
//     borderColor: "#bbb",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 15,
//   },
//   addText: {
//     color: "#999",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

import { SignOutButton } from "@/components/SignOutButton";
import { useCurrentTeamData } from "@/contexts/team-data-context";
import { getTeamMembers } from "@/pages/Team/API/api-calls";
import { AddTeamMember } from "@/pages/Team/components/add-member";
import { JoinRequests } from "@/pages/Team/components/join-requests";
import { TeamMembersList } from "@/pages/Team/components/member-list";
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

  // ...same sample data from your code:
  // users, setUsers, joinRequests, setJoinRequests, refreshing, setRefreshing
  // ...same handlers as original code

  // handlers, formatting, getRoleIcon, getRoleColor, etc.

  // (All handlers, sample data, helpers are unchanged from your version above...)

  // Place these as in your provided code, then use components:

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { teamid } = useLocalSearchParams();

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
    fetchMembers();
  }, [teamid]);

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
        <SignOutButton />

        {/* Join Requests */}
        <JoinRequests joinRequests={currentTeamData.joinRequests} />
        {/* Team Members List */}
        <TeamMembersList
          users={members}
          getRoleIcon={getRoleIcon}
          getRoleColor={getRoleColor}
        />

        {/* Invite New Member Button */}
        <View style={{ margin: 20 }}>
          <TouchableOpacity
            onPress={() => router.push("/")}
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
