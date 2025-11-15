import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Keys used in AsyncStorage
 */
const STORAGE_KEYS = {
  selectedWorkMode: "@app:selectedWorkMode",
  selectedModeTask: "@app:selectedModeTask",
  isModeTaskInProgress: "@app:isModeTaskInProgress",
  modeTaskStartedAt: "@app:modeTaskStartedAt",
  isCustomDurationMode: "@app:isCustomDurationMode",
};

type PersistedState = {
  selectedWorkMode?: "pomodoro" | "focus";
  selectedModeTask?: any | null;
  isModeTaskInProgress?: boolean;
  modeTaskStartedAt?: string | null; // ISO string
  isCustomDurationMode?: boolean;
};

type BottomSheetContextValue = {
  isVisible: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setVisible: (v: boolean) => void;
  selectedWorkMode: "pomodoro" | "focus";
  setSelectedWorkMode: Dispatch<SetStateAction<"pomodoro" | "focus">>;
  selectedModeTask: any | null;
  setSelectedModeTask: Dispatch<SetStateAction<any | null>>;
  isModeTaskInProgress: boolean;
  startMode: (opts?: {
    task?: any;
    custom?: boolean;
    startedAt?: Date;
  }) => void;
  stopMode: () => void;
  modeTaskStartedAt?: Date | null;
  isCustomDurationMode: boolean;
  hydrated: boolean; // true when initial load from storage finished
};

const SelectModeBottomSheetContext = createContext<
  BottomSheetContextValue | undefined
>(undefined);

export const SelectModeBottomSheetProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // persisted bits
  const [selectedWorkMode, setSelectedWorkMode] = useState<
    "pomodoro" | "focus"
  >("pomodoro");
  const [selectedModeTask, setSelectedModeTask] = useState<any | null>(null);
  const [isModeTaskInProgress, setIsModeTaskInProgress] = useState(false);
  const [modeTaskStartedAt, setModeTaskStartedAt] = useState<Date | null>(null);
  const [isCustomDurationMode, setIsCustomDurationMode] = useState(false);

  // hydrate state indicator
  const [hydrated, setHydrated] = useState(false);

  // helpers to read/write JSON safely
  const writeKey = useCallback(async (key: string, value: any) => {
    try {
      if (value === undefined) return;
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn("AsyncStorage write error:", err);
    }
  }, []);

  const readAll = useCallback(async (): Promise<PersistedState> => {
    try {
      const [a, b, c, d, e] = await AsyncStorage.multiGet([
        STORAGE_KEYS.selectedWorkMode,
        STORAGE_KEYS.selectedModeTask,
        STORAGE_KEYS.isModeTaskInProgress,
        STORAGE_KEYS.modeTaskStartedAt,
        STORAGE_KEYS.isCustomDurationMode,
      ]);
      const map = Object.fromEntries([a, b, c, d, e] as [string, string][]);
      const parsed: PersistedState = {};
      if (map[STORAGE_KEYS.selectedWorkMode]) {
        parsed.selectedWorkMode = JSON.parse(
          map[STORAGE_KEYS.selectedWorkMode]
        );
      }
      if (map[STORAGE_KEYS.selectedModeTask]) {
        parsed.selectedModeTask = JSON.parse(
          map[STORAGE_KEYS.selectedModeTask]
        );
      }
      if (map[STORAGE_KEYS.isModeTaskInProgress]) {
        parsed.isModeTaskInProgress = JSON.parse(
          map[STORAGE_KEYS.isModeTaskInProgress]
        );
      }
      if (map[STORAGE_KEYS.modeTaskStartedAt]) {
        parsed.modeTaskStartedAt = JSON.parse(
          map[STORAGE_KEYS.modeTaskStartedAt]
        );
      }
      if (map[STORAGE_KEYS.isCustomDurationMode]) {
        parsed.isCustomDurationMode = JSON.parse(
          map[STORAGE_KEYS.isCustomDurationMode]
        );
      }
      return parsed;
    } catch (err) {
      console.warn("AsyncStorage read error:", err);
      return {};
    }
  }, []);

  // Hydrate once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await readAll();
      if (!mounted) return;

      if (data.selectedWorkMode) setSelectedWorkMode(data.selectedWorkMode);
      if (data.selectedModeTask) setSelectedModeTask(data.selectedModeTask);
      if (typeof data.isModeTaskInProgress === "boolean")
        setIsModeTaskInProgress(data.isModeTaskInProgress);
      if (data.modeTaskStartedAt) {
        // parse ISO -> Date
        setModeTaskStartedAt(new Date(data.modeTaskStartedAt));
      }
      if (typeof data.isCustomDurationMode === "boolean")
        setIsCustomDurationMode(data.isCustomDurationMode);

      setHydrated(true);
    })();

    return () => {
      mounted = false;
    };
  }, [readAll]);

  // Persist when any relevant state changes
  useEffect(() => {
    // don't write until hydrated (avoid overwriting with defaults)
    if (!hydrated) return;

    writeKey(STORAGE_KEYS.selectedWorkMode, selectedWorkMode);
  }, [selectedWorkMode, hydrated, writeKey]);

  useEffect(() => {
    if (!hydrated) return;
    writeKey(STORAGE_KEYS.selectedModeTask, selectedModeTask);
  }, [selectedModeTask, hydrated, writeKey]);

  useEffect(() => {
    if (!hydrated) return;
    writeKey(STORAGE_KEYS.isModeTaskInProgress, isModeTaskInProgress);
  }, [isModeTaskInProgress, hydrated, writeKey]);

  useEffect(() => {
    if (!hydrated) return;
    // store ISO string or null
    writeKey(
      STORAGE_KEYS.modeTaskStartedAt,
      modeTaskStartedAt ? modeTaskStartedAt.toISOString() : null
    );
  }, [modeTaskStartedAt, hydrated, writeKey]);

  useEffect(() => {
    if (!hydrated) return;
    writeKey(STORAGE_KEYS.isCustomDurationMode, isCustomDurationMode);
  }, [isCustomDurationMode, hydrated, writeKey]);

  // exposed start/stop helpers — call these instead of directly setting flags
  const startMode = useCallback(
    (opts?: { task?: any; custom?: boolean; startedAt?: Date }) => {
      const now = opts?.startedAt ?? new Date();
      if (opts?.task) setSelectedModeTask(opts.task);
      setIsCustomDurationMode(!!opts?.custom);
      setModeTaskStartedAt(now);
      setIsModeTaskInProgress(true);
      // persist immediate (optimistic)
      writeKey(STORAGE_KEYS.isModeTaskInProgress, true);
      writeKey(
        STORAGE_KEYS.modeTaskStartedAt,
        (now && now.toISOString()) || null
      );
      if (opts?.task) writeKey(STORAGE_KEYS.selectedModeTask, opts.task);
    },
    [writeKey]
  );

  const stopMode = useCallback(() => {
    setIsModeTaskInProgress(false);
    setModeTaskStartedAt(null);
    // leave selectedModeTask if you want; remove if you prefer:
    // setSelectedModeTask(null);
    writeKey(STORAGE_KEYS.isModeTaskInProgress, false);
    writeKey(STORAGE_KEYS.modeTaskStartedAt, null);
  }, [writeKey]);

  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible((s) => !s), []);

  // helper to compute elapsed minutes since start (useful when resuming)
  const elapsedMinutes = useMemo(() => {
    if (!modeTaskStartedAt) return 0;
    const now = Date.now();
    const started = modeTaskStartedAt.getTime();
    const diff = Math.max(0, now - started);
    return Math.floor(diff / 1000 / 60);
  }, [modeTaskStartedAt]);

  return (
    <SelectModeBottomSheetContext.Provider
      value={{
        isVisible,
        open,
        close,
        toggle,
        setVisible: setIsVisible,
        selectedWorkMode,
        setSelectedWorkMode,
        selectedModeTask,
        setSelectedModeTask,
        isModeTaskInProgress,
        startMode,
        stopMode,
        modeTaskStartedAt,
        isCustomDurationMode,
        hydrated,
      }}
    >
      {children}
    </SelectModeBottomSheetContext.Provider>
  );
};

export const useSelectMode = () => {
  const ctx = useContext(SelectModeBottomSheetContext);
  if (!ctx)
    throw new Error(
      "useSelectMode must be used within SelectModeBottomSheetProvider"
    );
  return ctx;
};
