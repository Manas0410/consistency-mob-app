import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { View } from "@/components/ui/view";
import { usePallet } from "@/hooks/use-pallet";
import React from "react";
import { editTasks } from "../API/editTasks";

type Props = {
  isChecked: boolean;
  taskId: string;
  selectedDate: Date;
};

const StatusChangeCheckbox = ({ isChecked, taskId, selectedDate }: Props) => {
  const [checked, setChecked] = React.useState(isChecked);
  const [loading, setLoading] = React.useState(false);

  const handleChange = async (checked: boolean) => {
    try {
      setLoading(true);

      // Simulate an API call
      const res = await editTasks(taskId, selectedDate, { isDone: checked });
      if (res.success) {
        setChecked(checked);
      } else {
        console.error("Error updating status:", res.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const pallet = usePallet();

  return (
    <View>
      {loading ? (
        <Spinner variant="default" size="default" color={pallet.shade1} />
      ) : (
        <Checkbox
          checked={checked}
          onCheckedChange={(checked) => handleChange(checked)}
          styles={{
            borderColor: pallet.shade3,
            backgroundColor: checked ? pallet.shade1 : undefined,
          }}
        />
      )}
    </View>
  );
};

export default StatusChangeCheckbox;
