import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export function TeamMembersList({ users, getRoleIcon, getRoleColor }) {
  const router = useRouter();

  if (!users.length) return null;

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
        <TouchableOpacity
          key={user.userId}
          onPress={() => {}}
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
          <ChevronRight size={20} color="#cbd5e1" />
        </TouchableOpacity>
      ))}
    </View>
  );
}
