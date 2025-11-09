import FocusControls from "@/components/focus/FocusControls";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useGetCurrentDayTask } from "@/contexts/todays-tasks-context";
import { usePallet } from "@/hooks/use-pallet";
import { Apple, Plus, Target } from "lucide-react-native";

const modes = {
  pomodoro: {
    modeName: "Pomodoro Mode",
    about:
      "The Pomodoro technique uses cycles of focused work followed by short breaks. Typically 25 minutes of deep work, then a 5-minute break. This helps maintain high focus while preventing mental fatigue.",
  },
  focus: {
    modeName: "Focus Mode",
    about:
      "A continuous, distraction-free work session with no scheduled breaks. You pick the duration and stay locked in until the timer ends. Ideal for tasks requiring deep concentration or creative flow.",
  },
};

const ModeStarter = ({ mode }: { mode: "pomodoro" | "focus" }) => {
  const pallet = usePallet();
  const { currentDayTask } = useGetCurrentDayTask();
  return (
    <View>
      <View
        style={{
          backgroundColor: pallet.buttonBg,
          height: 50,
          width: 50,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: "auto",
          marginBottom: 20,
        }}
      >
        <Icon
          name={mode === "pomodoro" ? Apple : Target}
          color={pallet.ButtonText}
        />
      </View>

      <Button
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
          backgroundColor: "transparent",
        }}
      >
        <Plus color={pallet.shade1} />
        <Text style={{ color: pallet.shade1 }}>Import Tasks</Text>
      </Button>
      <View>
        {currentDayTask.map((item) => (
          <Text
            key={item.taskId}
            variant="caption"
            style={{ marginHorizontal: 6 }}
          >
            {item.taskName}
          </Text>
        ))}
      </View>
      <Text style={{ textAlign: "center" }} variant="caption">
        OR
      </Text>
      <Text style={{ textAlign: "center" }} variant="subtitle">
        Start with custom hour
      </Text>

      <FocusControls />
      <Accordion
        key={mode}
        type="single"
        style={{ backgroundColor: "#fff", padding: 10, borderRadius: 8 }}
        collapsible
      >
        <AccordionItem value={"mofde"}>
          <AccordionTrigger>
            <Text>
              About{" "}
              <Text style={{ color: pallet.shade1 }}>
                {modes[mode].modeName}
              </Text>
            </Text>{" "}
          </AccordionTrigger>
          <AccordionContent>
            <Text
              variant="caption"
              style={{ marginHorizontal: 6, fontSize: 12 }}
            >
              {modes[mode].about}
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
};

export default ModeStarter;
