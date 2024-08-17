import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserAction } from "./userAction";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  offlineMode: false,
  isLoggedIn: false,
  profile: {},
};

export const useUserStore = create(
  persist(
    (set, get, store) => ({
      ...initialState,
      ...UserAction(set, get),
    }),
    {
      name: "user-store",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
