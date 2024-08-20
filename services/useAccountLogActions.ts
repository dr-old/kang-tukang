import { AccountLog } from "@/schemes/AccountLogScheme";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Realm, useRealm } from "@realm/react";

export const useAccountLogActions = () => {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const realm = useRealm();

  const createLog = (logData: {
    accountId: Realm.BSON.ObjectId;
    accountType: number;
    status: number;
    balance: number;
  }) => {
    realm.write(() => {
      realm.create(AccountLog, {
        accountId: logData.accountId,
        accountType: logData.accountType,
        status: logData.status,
        balance: logData.balance,
        userId,
      });
    });
  };

  return { createLog };
};
