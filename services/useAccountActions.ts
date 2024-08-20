import { Account } from "@/schemes/AccountScheme";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Realm, useRealm } from "@realm/react";

export const useAccountActions = () => {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const realm = useRealm();

  const topupBalance = (account: any) => {
    let insertedId: any;
    realm.write(() => {
      let existingAccount = realm
        .objects(Account)
        .filtered(
          "userId == $0 AND accountType == $1",
          userId,
          account.accountType
        )[0];

      if (existingAccount) {
        // Increment the balance
        existingAccount.balance += account.balance;
        insertedId = existingAccount;
      } else {
        // Create a new account
        const newAccount = realm.create(Account, {
          _id: new Realm.BSON.ObjectId(),
          accountName: account.accountName,
          accountType: account.accountType,
          balance: Number(account.balance),
          userId,
        });
        insertedId = newAccount;
      }
    });
    return insertedId;
  };

  const incrementBalance = (accountId: string, amount: number) => {
    realm.write(() => {
      const account = realm
        .objects(Account)
        .filtered("_id == $0", new Realm.BSON.ObjectId(accountId))[0];
      if (account) {
        account.balance += amount;
      }
    });
  };

  const decrementBalance = (amount: number) => {
    realm.write(() => {
      const account = realm
        .objects(Account)
        .filtered("userId == $0", userId)[0];
      if (account && account.balance >= amount) {
        account.balance -= amount;
      }
    });
  };

  const getBalanceByUserid = () => {
    const account = realm.objects(Account).filtered("userId == $0", userId)[0];
    return account ? account.balance : null;
  };

  const getByUserid = () => {
    const account = realm.objects(Account).filtered("userId == $0", userId)[0];
    return account ?? null;
  };

  return {
    topupBalance,
    incrementBalance,
    decrementBalance,
    getBalanceByUserid,
    getByUserid,
  };
};
