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

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Check,
  ChevronRight,
  Clock,
  Crown,
  Settings,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TeamManagement() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Sample data - replace with actual API calls
  const [users, setUsers] = useState([
    {
      userId: "user_33yAvVPP8NDOdO1peRCOwEGrAF7",
      userName: "John Smith",
      role: "admin",
    },
    {
      userId: "user_44zBwWQQ9OEPeP2qfSDPxFHsBG8",
      userName: "Sarah Johnson",
      role: "member",
    },
    {
      userId: "user_55aCxXRR0PFQfQ3rgTEQyGItCH9",
      userName: "Mike Davis",
      role: "member",
    },
    {
      userId: "user_66bDyYSS1QGRgR4shUFRzHJuDI0",
      userName: "Emma Wilson",
      role: "member",
    },
  ]);

  const [joinRequests, setJoinRequests] = useState([
    {
      requestId: "req_001",
      userId: "user_77cEzZTT2RHShS5tiVGS0IKvEJ1",
      userName: "Alex Thompson",
      requestDate: "2025-10-26T10:30:00Z",
      message:
        "I'd like to join the team to collaborate on productivity tracking.",
    },
    {
      requestId: "req_002",
      userId: "user_88dF0UU3SITiT6ujWHS1JLwFK2",
      userName: "Lisa Chen",
      requestDate: "2025-10-25T15:45:00Z",
      message: "Looking forward to being part of this amazing team!",
    },
    {
      requestId: "req_003",
      userId: "user_99eG1VV4TJUjU7vkXIT2KMxGL3",
      userName: "David Brown",
      requestDate: "2025-10-24T09:15:00Z",
      message:
        "I have experience in project management and would love to contribute.",
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleApproveRequest = (requestId, userName) => {
    Alert.alert(
      "Approve Request",
      `Are you sure you want to approve ${userName}'s request to join the team?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          style: "default",
          onPress: () => {
            // Remove from requests and add to users
            const request = joinRequests.find(
              (req) => req.requestId === requestId
            );
            if (request) {
              setJoinRequests((prev) =>
                prev.filter((req) => req.requestId !== requestId)
              );
              setUsers((prev) => [
                ...prev,
                {
                  userId: request.userId,
                  userName: request.userName,
                  role: "member",
                },
              ]);
              Alert.alert("Success", `${userName} has been added to the team!`);
            }
          },
        },
      ]
    );
  };

  const handleRejectRequest = (requestId, userName) => {
    Alert.alert(
      "Reject Request",
      `Are you sure you want to reject ${userName}'s request to join the team?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setJoinRequests((prev) =>
              prev.filter((req) => req.requestId !== requestId)
            );
            Alert.alert(
              "Request Rejected",
              `${userName}'s request has been rejected.`
            );
          },
        },
      ]
    );
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

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

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#e2e8f0",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Users size={24} color="#1e293b" />
          <Text
            style={{
              color: "#1e293b",
              fontSize: 20,
              fontWeight: "700",
              marginLeft: 12,
            }}
          >
            Team Management
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Settings size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Team Stats */}
        <View style={{ padding: 20, backgroundColor: "#fff" }}>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#f1f5f9",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Users size={20} color="#3b82f6" />
              <Text
                style={{
                  color: "#1e293b",
                  fontSize: 24,
                  fontWeight: "700",
                  marginTop: 8,
                }}
              >
                {users.length}
              </Text>
              <Text
                style={{
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                Team Members
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "#fef3c7",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Crown size={20} color="#f59e0b" />
              <Text
                style={{
                  color: "#1e293b",
                  fontSize: 24,
                  fontWeight: "700",
                  marginTop: 8,
                }}
              >
                {users.filter((user) => user.role === "admin").length}
              </Text>
              <Text
                style={{
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                Admins
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "#fee2e2",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Clock size={20} color="#ef4444" />
              <Text
                style={{
                  color: "#1e293b",
                  fontSize: 24,
                  fontWeight: "700",
                  marginTop: 8,
                }}
              >
                {joinRequests.length}
              </Text>
              <Text
                style={{
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                Pending
              </Text>
            </View>
          </View>
        </View>

        {/* Join Requests Section */}
        {joinRequests.length > 0 && (
          <View
            style={{
              marginTop: 8,
              backgroundColor: "#fff",
              paddingVertical: 20,
            }}
          >
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
              <Text
                style={{
                  color: "#1e293b",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Join Requests ({joinRequests.length})
              </Text>
              <Text
                style={{
                  color: "#64748b",
                  fontSize: 14,
                  marginTop: 4,
                }}
              >
                Review and approve team member requests
              </Text>
            </View>

            {joinRequests.map((request) => (
              <View
                key={request.requestId}
                style={{
                  marginHorizontal: 20,
                  backgroundColor: "#f8fafc",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: "#e2e8f0",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 12,
                        }}
                      >
                        <UserPlus size={20} color="#64748b" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: "#1e293b",
                            fontSize: 16,
                            fontWeight: "600",
                          }}
                        >
                          {request.userName}
                        </Text>
                        <Text
                          style={{
                            color: "#64748b",
                            fontSize: 12,
                            marginTop: 2,
                          }}
                        >
                          {formatDate(request.requestDate)}
                        </Text>
                      </View>
                    </View>

                    {request.message && (
                      <Text
                        style={{
                          color: "#64748b",
                          fontSize: 14,
                          lineHeight: 20,
                          marginBottom: 16,
                        }}
                      >
                        "{request.message}"
                      </Text>
                    )}

                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <TouchableOpacity
                        onPress={() =>
                          handleApproveRequest(
                            request.requestId,
                            request.userName
                          )
                        }
                        style={{
                          flex: 1,
                          backgroundColor: "#10b981",
                          borderRadius: 8,
                          paddingVertical: 10,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check size={16} color="#fff" />
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: "600",
                            marginLeft: 6,
                          }}
                        >
                          Approve
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          handleRejectRequest(
                            request.requestId,
                            request.userName
                          )
                        }
                        style={{
                          flex: 1,
                          backgroundColor: "#ef4444",
                          borderRadius: 8,
                          paddingVertical: 10,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={16} color="#fff" />
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: "600",
                            marginLeft: 6,
                          }}
                        >
                          Reject
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Team Members List */}
        <View
          style={{ marginTop: 8, backgroundColor: "#fff", paddingVertical: 20 }}
        >
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <Text
              style={{
                color: "#1e293b",
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Team Members ({users.length})
            </Text>
            <Text
              style={{
                color: "#64748b",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              Current team members and their roles
            </Text>
          </View>

          {users.map((user, index) => (
            <TouchableOpacity
              key={user.userId}
              onPress={() => router.push(`/`)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: index < users.length - 1 ? 1 : 0,
                borderBottomColor: "#f1f5f9",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor:
                    user.role === "admin" ? "#fef3c7" : "#f1f5f9",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Text
                  style={{
                    color: user.role === "admin" ? "#f59e0b" : "#64748b",
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  {user.userName.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#1e293b",
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 4,
                  }}
                >
                  {user.userName}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {getRoleIcon(user.role)}
                  <Text
                    style={{
                      color: getRoleColor(user.role),
                      fontSize: 14,
                      fontWeight: "500",
                      marginLeft: 6,
                      textTransform: "capitalize",
                    }}
                  >
                    {user.role}
                  </Text>
                </View>
              </View>

              <ChevronRight size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Invite New Member */}
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
