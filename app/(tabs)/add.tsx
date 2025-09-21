import TaskDrawer from "@/components/ui/task-drawer";
import AddForm from "@/pages/add/add-form";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const AddScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(true);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AddForm />
      <TaskDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onDone={() => setDrawerVisible(false)}
      />
    </SafeAreaView>
  );
};

export default AddScreen;
