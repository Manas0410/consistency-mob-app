import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { Check, UserPlus, X } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { acceptTeamRequest, rejectTeamRequest } from "../API/api-calls";

/**
 * props:
 *  - joinRequests: array
 *  - onRefreshRequested?: () => Promise<void> | void
 */
export function JoinRequests({ joinRequests = [], onRefreshRequested }: any) {
  const { teamid } = useLocalSearchParams();
  const [loadingMap, setLoadingMap] = useState<
    Record<string, { a?: boolean; r?: boolean }>
  >({});

  if (!joinRequests?.length) {
    return (
      <Text style={{ margin: 15 }} variant="caption">
        No Joining Requests{" "}
      </Text>
    );
  }

  const handleApproveRequest = async (userId: string) => {
    // confirm
    Alert.alert(
      "Approve request",
      "Approve this user's request to join the team?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              setLoadingMap((s) => ({
                ...s,
                [userId]: { ...(s[userId] ?? {}), a: true },
              }));
              await acceptTeamRequest(teamid, userId);
              if (typeof onRefreshRequested === "function")
                await onRefreshRequested();
            } catch (err) {
              console.error("approve error", err);
              Alert.alert("Error", "Could not approve request. Try again.");
            } finally {
              setLoadingMap((s) => ({
                ...s,
                [userId]: { ...(s[userId] ?? {}), a: false },
              }));
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleRejectRequest = async (userId: string) => {
    Alert.alert(
      "Reject request",
      "Reject this user's request to join the team?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          onPress: async () => {
            try {
              setLoadingMap((s) => ({
                ...s,
                [userId]: { ...(s[userId] ?? {}), r: true },
              }));
              await rejectTeamRequest(teamid, userId);
              if (typeof onRefreshRequested === "function")
                await onRefreshRequested();
            } catch (err) {
              console.error("reject error", err);
              Alert.alert("Error", "Could not reject request. Try again.");
            } finally {
              setLoadingMap((s) => ({
                ...s,
                [userId]: { ...(s[userId] ?? {}), r: false },
              }));
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View
      style={{ marginTop: 8, backgroundColor: "#fff", paddingVertical: 20 }}
    >
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <Text style={{ color: "#1e293b", fontSize: 18, fontWeight: "600" }}>
          Join Requests ({joinRequests.length})
        </Text>
        <Text style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
          Review and approve team member requests
        </Text>
      </View>

      {joinRequests.map((request: any) => {
        const l = loadingMap[request.userId] ?? { a: false, r: false };
        return (
          <View
            key={request.userId}
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
                      {request?.userName}
                    </Text>
                    <Text
                      style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}
                    >
                      {/* Optional date */}
                      {"Requested recently"}
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
                    onPress={() => handleApproveRequest(request.userId)}
                    disabled={l.a}
                    style={{
                      flex: 1,
                      backgroundColor: "#10b981",
                      borderRadius: 8,
                      paddingVertical: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: l.a ? 0.8 : 1,
                    }}
                  >
                    {l.a ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Check size={16} color="#fff" />
                    )}
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
                    onPress={() => handleRejectRequest(request.userId)}
                    disabled={l.r}
                    style={{
                      flex: 1,
                      backgroundColor: "#ef4444",
                      borderRadius: 8,
                      paddingVertical: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: l.r ? 0.8 : 1,
                    }}
                  >
                    {l.r ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <X size={16} color="#fff" />
                    )}
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
        );
      })}
    </View>
  );
}
