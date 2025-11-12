import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useAddTeamMemberBottomSheet } from "@/contexts/add-team-member-context";
import * as Clipboard from "expo-clipboard";
import { Copy } from "lucide-react-native"; // Lucide copy icon, install if needed
import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

export function AddTeamMember({ teamid }) {
  const { isVisible, close } = useAddTeamMemberBottomSheet();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (teamid) {
      await Clipboard.setStringAsync(teamid);
      setCopied(true);
      Alert.alert("Copied to clipboard!", `Team code: ${teamid}`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View>
      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        snapPoints={[0.4, 0.6, 0.9]}
      >
        <View style={{ gap: 16 }}>
          <Text variant="title">Add Member</Text>
          <Text variant="caption">
            Share below code and ask members to request with this code
          </Text>
        </View>

        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{teamid || "No code available"}</Text>
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
            <Copy size={18} color={copied ? "green" : "#333"} />
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  codeContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  codeText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  copyButton: {
    marginLeft: 12,
  },
});
