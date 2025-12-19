import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import { Trash2, UserStar } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { makeAdmin, removeFromTeam } from "../API/api-calls";

export function TeamMembersList({
  users,
  getRoleIcon,
  getRoleColor,
  isAdmin,
  onRefreshRequested,
}: any) {
  const user = useUser();
  const loggedinId = user.user?.id;

  const { teamid } = useLocalSearchParams();
  // actionLoading maps userId -> "make-admin" | "remove-user"
  const [actionLoading, setActionLoading] = useState<Record<string, string>>(
    {}
  );

  if (!users?.length)
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;

  const confirmAndPerform = (
    action: "make-admin" | "remove-user",
    userId: string
  ) =>
    new Promise<boolean>((resolve, reject) => {
      Alert.alert(
        action === "make-admin" ? "Make admin" : "Remove user",
        "Are you sure you want to continue?",
        [
          { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
          {
            text: "Continue",
            onPress: async () => {
              try {
                // mark which action is loading for this user
                setActionLoading((s) => ({ ...s, [userId]: action }));

                if (action === "make-admin") {
                  await makeAdmin(teamid, userId);
                } else {
                  await removeFromTeam(teamid, userId);
                }

                if (typeof onRefreshRequested === "function") {
                  await onRefreshRequested();
                }

                resolve(true);
              } catch (err) {
                console.error("TeamMembersList action error:", err);
                Alert.alert("Error", "Something went wrong. Please try again.");
                reject(err);
              } finally {
                // remove the loading key for this user
                setActionLoading((s) => {
                  const copy = { ...s };
                  delete copy[userId];
                  return copy;
                });
              }
            },
          },
        ],
        { cancelable: false }
      );
    });

  return (
    <View
      style={{ marginTop: 8, backgroundColor: "#fff", paddingVertical: 20 }}
    >
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <Text style={{ color: "#1e293b", fontSize: 18, fontWeight: "600" }}>
          Team Members ({users.length})
        </Text>
        <Text style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
          Current team members and their roles
        </Text>
      </View>

      {users.map((user: any, index: number) => {
        const currentAction = actionLoading[user.userId]; // undefined | "make-admin" | "remove-user"
        const anyLoadingForUser = !!currentAction;
        const isMakingAdmin = currentAction === "make-admin";
        const isRemoving = currentAction === "remove-user";

        return (
          <View
            key={user.userId}
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
                backgroundColor: user.role === "admin" ? "#fef3c7" : "#f1f5f9",
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
                {String(user.userName || "?")
                  .charAt(0)
                  .toUpperCase()}
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

            <View style={{ flexDirection: "row", gap: 6 }}>
              {user.role !== "admin" && isAdmin && (
                <TouchableOpacity
                  onPress={() => confirmAndPerform("make-admin", user.userId)}
                  // disable while any action for this user is running
                  disabled={anyLoadingForUser}
                  style={{
                    backgroundColor: anyLoadingForUser
                      ? "#f3ecdfe0"
                      : "#ecdcbf5b",
                    padding: 10,
                    borderRadius: 10,
                    opacity: anyLoadingForUser ? 0.8 : 1,
                  }}
                >
                  {isMakingAdmin ? (
                    <ActivityIndicator size="small" color="#f59e0b" />
                  ) : (
                    <UserStar size={18} color="#f59e0b" />
                  )}
                </TouchableOpacity>
              )}

              {isAdmin && loggedinId !== user.userId && (
                <TouchableOpacity
                  onPress={() => confirmAndPerform("remove-user", user.userId)}
                  disabled={anyLoadingForUser}
                  style={{
                    backgroundColor: anyLoadingForUser ? "#feecec" : "#FEF2F2",
                    padding: 10,
                    borderRadius: 10,
                    opacity: anyLoadingForUser ? 0.8 : 1,
                  }}
                >
                  {isRemoving ? (
                    <ActivityIndicator size="small" color="#F87171" />
                  ) : (
                    <Trash2 size={18} color="#F87171" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
