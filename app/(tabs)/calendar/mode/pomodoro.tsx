import PomodoroModeScreen from "@/pages/taskMode/Pomodor-timer";

const PomoDoro = () => {
  return (
    // <View style={{ flex: 1, backgroundColor: "#fff" }}>
    //   <SafeAreaView>
    //     <BackHeader title="Pomodoro Mode" />
    <PomodoroModeScreen
      taskName="Write project report"
      totalMinutes={120} // e.g. 10 | 30 | 60 | 120 | 480
      workMinutes={25} // optional, defaults shown
      shortBreakMinutes={5}
      longBreakMinutes={15}
      cyclesBeforeLongBreak={4}
      autoStartNext
    />
    //   </SafeAreaView>
    // </View>
  );
};

export default PomoDoro;
