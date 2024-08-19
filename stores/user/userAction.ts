import { produce } from "immer";

export const UserAction = (
  set: (fn: (prevState: any) => void) => void,
  get: () => any
) => {
  return {
    setOfflineMode: async (params: any) => {
      set(
        produce((state) => {
          state.offlineMode = params;
        })
      );
    },
    setProfile: async (params: any) => {
      set(
        produce((state) => {
          state.profile = params;
        })
      );
    },
    setLogIn: async (params: any) => {
      set(
        produce((state) => {
          state.isLoggedIn = params;
        })
      );
    },
  };
};
