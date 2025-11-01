import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { View } from "@/components/ui/view";
import { Plus } from "lucide-react-native";
import { useState } from "react";

const dummy = ["asdfg", "asdfgh", "tyui", "wertyui", "qwertyui"];

const AddPriority = () => {
  const [value, setValue] = useState();
  return (
    <View>
      <View>
        <Input value={value} />
        <Button>
          <Plus />
        </Button>
      </View>
      <View></View>
    </View>
  );
};

export default AddPriority;
