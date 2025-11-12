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

/**
 * props:
 *  - users: array
 *  - getRoleIcon, getRoleColor
 *  - isAdmin: boolean
 *  - onRefreshRequested: () => Promise<void> | void  // parent refresh callback
 */
export function TeamMembersList({
  users,
  getRoleIcon,
  getRoleColor,
  isAdmin,
  onRefreshRequested,
}: any) {
  const { teamid } = useLocalSearchParams();
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );

  if (!users?.length) return null;

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
                setActionLoading((s) => ({ ...s, [userId]: true }));

                if (action === "make-admin") {
                  await makeAdmin(teamid, userId);
                } else {
                  await removeFromTeam(teamid, userId);
                }

                // inform parent to refresh lists
                if (typeof onRefreshRequested === "function") {
                  await onRefreshRequested();
                }

                resolve(true);
              } catch (err) {
                console.error("TeamMembersList action error:", err);
                Alert.alert("Error", "Something went wrong. Please try again.");
                reject(err);
              } finally {
                setActionLoading((s) => ({ ...s, [userId]: false }));
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
        const loadingForUser = !!actionLoading[user.userId];
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
                  disabled={loadingForUser}
                  style={{
                    backgroundColor: loadingForUser ? "#f3ecdfe0" : "#ecdcbf5b",
                    padding: 10,
                    borderRadius: 10,
                    opacity: loadingForUser ? 0.8 : 1,
                  }}
                >
                  {loadingForUser ? (
                    <ActivityIndicator size="small" color="#f59e0b" />
                  ) : (
                    <UserStar size={18} color="#f59e0b" />
                  )}
                </TouchableOpacity>
              )}

              {isAdmin && (
                <TouchableOpacity
                  onPress={() => confirmAndPerform("remove-user", user.userId)}
                  disabled={loadingForUser}
                  style={{
                    backgroundColor: loadingForUser ? "#feecec" : "#FEF2F2",
                    padding: 10,
                    borderRadius: 10,
                    opacity: loadingForUser ? 0.8 : 1,
                  }}
                >
                  {loadingForUser ? (
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
