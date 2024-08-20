import { TransactionLog } from "@/schemes/TransactionLogScheme";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Realm, useRealm } from "@realm/react";

export const useTransactionLogActions = () => {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const realm = useRealm();

  // Add a new transaction log
  const createTransactionLog = (trx: any) => {
    try {
      realm.write(() => {
        realm.create(TransactionLog, {
          trxId: trx.trxId,
          status: trx.status,
          requesterId: trx.requesterId,
          responderId: trx.responderId,
        });
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Update a transaction log by its _id
  const updateTransactionLog = (
    logId: Realm.BSON.ObjectId,
    updates: Partial<{
      trxId: string;
      status: number;
      requesterId: Realm.BSON.ObjectId;
      responderId?: string;
      createdAt: Date;
      updatedAt: Date;
    }>
  ) => {
    realm.write(() => {
      const log = realm.objectForPrimaryKey(TransactionLog, logId);
      if (log) {
        Object.assign(log, updates, { updatedAt: new Date() });
      }
    });
  };

  // Delete a transaction log by its _id
  const deleteTransactionLog = (logId: Realm.BSON.ObjectId) => {
    realm.write(() => {
      const log = realm.objectForPrimaryKey(TransactionLog, logId);
      if (log) {
        realm.delete(log);
      }
    });
  };

  // Get all transaction logs
  const getAllTransactionLogs = () => {
    return realm.objects(TransactionLog);
  };

  // Get a transaction log by its _id
  const getTransactionLogByTrxid = (trxId: string) => {
    return realm
      .objects(TransactionLog)
      .filtered("trxId == $0", trxId)
      .sorted("createdAt", true);
  };

  // Optionally, you can add methods to filter logs based on specific criteria
  const getTransactionLogsByStatus = (status: number) => {
    return realm.objects(TransactionLog).filtered("status == $0", status);
  };

  const getTransactionLogsByRequesterId = (
    requesterId: Realm.BSON.ObjectId
  ) => {
    return realm
      .objects(TransactionLog)
      .filtered("requesterId == $0", requesterId);
  };

  const getTransactionLogsByResponderId = (
    responderId: Realm.BSON.ObjectId
  ) => {
    return realm
      .objects(TransactionLog)
      .filtered("responderId == $0", responderId);
  };

  return {
    createTransactionLog,
    updateTransactionLog,
    deleteTransactionLog,
    getAllTransactionLogs,
    getTransactionLogByTrxid,
    getTransactionLogsByStatus,
    getTransactionLogsByRequesterId,
    getTransactionLogsByResponderId,
  };
};
