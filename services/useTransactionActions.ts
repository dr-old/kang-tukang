import { Realm, useRealm } from "@realm/react";
import { Transaction } from "@/schemes/TransactionScheme"; // Adjust the import path accordingly
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { User } from "@/schemes/UserScheme";

export const useTransactionActions = () => {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const realm = useRealm();
  const userId = new Realm.BSON.ObjectId(profile?._id);

  // Create a new transaction
  const createTransaction = (trx: any) => {
    try {
      realm.write(() => {
        realm.create(Transaction, {
          ...trx,
          userId,
        });
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Read/Get a transaction by ID
  const getTransactionById = (transactionId: string) => {
    return realm.objectForPrimaryKey(
      Transaction,
      new Realm.BSON.ObjectId(transactionId)
    );
  };

  const getTransactionByTrxid = (trxId: string) => {
    const transaction = realm
      .objects(Transaction)
      .filtered("trxId == $0", trxId)
      .sorted("createdAt", true)[0];
    if (transaction?.handymanId) {
      const handyman = realm.objectForPrimaryKey(
        User,
        new Realm.BSON.ObjectId(transaction.handymanId)
      );
      if (handyman) {
        const { _id, name, phone, photo, role } = handyman;
        return { ...transaction, handyman: { _id, name, phone, photo, role } };
      }
    }
    return transaction;
  };

  // Read/Get a transaction by status and user id
  const getTransactionByStatusAndHandymanId = (
    status: number,
    handymanId: string,
    desc?: boolean
  ) => {
    return realm
      .objects(Transaction)
      .filtered("status == $0 AND handymanId == $1", status, handymanId)
      .sorted("createdAt", desc);
  };

  const getTransactionByHandymanId = (handymanId: string) => {
    return realm
      .objects(Transaction)
      .filtered("handymanId == $0 && status > $1", handymanId, 1)
      .sorted("createdAt", true);
  };

  // Read/Get a transaction by status
  const getTransactionByStatus = (status: number, desc?: boolean) => {
    return realm
      .objects(Transaction)
      .filtered("status == $0", status)
      .sorted("createdAt", desc);
  };

  const getTransactionByUserid = (userId: string) => {
    return realm
      .objects(Transaction)
      .filtered("userId == $0", new Realm.BSON.ObjectId(userId))
      .sorted("createdAt", true);
  };

  // Update a transaction
  const updateTransaction = (
    transactionId: string,
    updatedData: Partial<Transaction>
  ) => {
    realm.write(() => {
      const transaction = realm.objectForPrimaryKey(
        Transaction,
        new Realm.BSON.ObjectId(transactionId)
      );
      if (transaction) {
        transaction.updatedAt = new Date();
        transaction.status = updatedData.status || transaction.status;
      }
    });
  };

  // Delete a transaction by ID
  const deleteTransaction = (transactionId: string) => {
    realm.write(() => {
      const transaction = realm.objectForPrimaryKey(
        Transaction,
        new Realm.BSON.ObjectId(transactionId)
      );
      if (transaction) {
        realm.delete(transaction);
      }
    });
  };

  // Read/Get all transactions
  const getAllTransactions = () => {
    return realm.objects(Transaction);
  };

  return {
    createTransaction,
    getTransactionById,
    getTransactionByTrxid,
    getTransactionByUserid,
    getTransactionByHandymanId,
    getTransactionByStatus,
    getTransactionByStatusAndHandymanId,
    updateTransaction,
    deleteTransaction,
    getAllTransactions,
  };
};
