import { useLocalSearchParams, useRouter } from "expo-router";
import { Trash2, UserStar } from "lucide-react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { makeAdmin, removeFromTeam } from "../API/api-calls";

export function TeamMembersList({ users, getRoleIcon, getRoleColor, isAdmin }) {
  const router = useRouter();

  if (!users.length) return null;

  const { teamid } = useLocalSearchParams();

  const performAction = async (action, userId) => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        `Confirm ${action}`,
        "Are you sure you want to continue?",
        [
          {
            text: "Cancel",
            onPress: () => resolve(false),
            style: "cancel",
          },
          {
            text: "Continue",
            onPress: async () => {
              try {
                switch (action) {
                  case "make-admin":
                    await makeAdmin(teamid, userId);
                    break;
                  case "remove-user":
                    await removeFromTeam(teamid, userId);
                    break;
                  default:
                    break;
                }
                resolve(true);
              } catch (error) {
                reject(error);
              }
            },
          },
        ],
        { cancelable: false }
      );
    });
  };

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
      {users.map((user, index) => (
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

          <View style={{ flexDirection: "row", gap: 6 }}>
            {user.role !== "admin" && isAdmin && (
              <TouchableOpacity
                onPress={() => {
                  performAction("make-admin", user.userId);
                }}
                style={{
                  backgroundColor: "#ecdcbf5b",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <UserStar size={18} color="#f59e0b" />
              </TouchableOpacity>
            )}

            {isAdmin && (
              <TouchableOpacity
                onPress={() => {
                  performAction("remove-user", user.userId);
                }}
                style={{
                  backgroundColor: "#FEF2F2",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Trash2 size={18} color="#F87171" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
