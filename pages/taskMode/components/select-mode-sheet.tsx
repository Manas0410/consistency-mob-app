import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useSelectMode } from "@/contexts/select-mode-context";
import { usePallet } from "@/hooks/use-pallet";
import { useRouter } from "expo-router";
import { useState } from "react";

export const SelectMode = () => {
  const [value, setValue] = useState("");
  const pallet = usePallet();
  const router = useRouter();
  const { setSelectedWorkMode, isVisible, close } = useSelectMode();

  return (
    <View>
      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        snapPoints={[0.4, 0.4, 0.4]}
      >
        <View style={{ flexDirection: "row" }}>
          <Text variant="heading" style={{ marginBottom: 12 }}>
            Select Work
          </Text>
          <Text
            variant="heading"
            style={{ marginBottom: 8, color: pallet.shade1 }}
          >
            {" "}
            Mode
          </Text>
        </View>

        <RadioGroup
          options={[
            { label: "Pomodoro Mode", value: "pomodoro" },
            { label: "Focus Mode", value: "focus" },
          ]}
          value={value}
          onValueChange={setValue}
        />

        {value && (
          <Button
            style={{
              marginTop: 30,
              marginLeft: "auto",
              backgroundColor: pallet.buttonBg,
              borderRadius: 8,
              width: 150,
              height: 40,
            }}
            textStyle={{ color: pallet.ButtonText, fontSize: 16 }}
            onPress={() => {
              setSelectedWorkMode(value);
              router.replace(`/calendar/mode`);
              close();
            }}
          >
            NEXT
          </Button>
        )}
      </BottomSheet>
    </View>
  );
};
