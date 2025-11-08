import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { usePallet } from "@/hooks/use-pallet";

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
  return (
    <View>
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
