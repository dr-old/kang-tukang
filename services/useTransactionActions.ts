import { Realm, useRealm } from "@realm/react";
import { Transaction } from "@/schemes/TransactionScheme"; // Adjust the import path accordingly
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";

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
    updateTransaction,
    deleteTransaction,
    getAllTransactions,
  };
};

// Example function to generate trxId
const generateTrxId = () => {
  return `TRX-${Date.now()}`;
};
