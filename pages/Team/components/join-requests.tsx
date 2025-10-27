import { Check, UserPlus, X } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export function JoinRequests({
  joinRequests,
  handleApproveRequest,
  handleRejectRequest,
  formatDate,
}) {
  if (!joinRequests.length) return null;

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
                    style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}
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
                    handleApproveRequest(request.requestId, request.userName)
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
                    handleRejectRequest(request.requestId, request.userName)
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
  );
}
