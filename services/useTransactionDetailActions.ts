import { Cart } from "@/schemes/CartScheme";
import { TransactionDetail } from "@/schemes/TransactionDetailScheme";
import { useRealm } from "@realm/react";
import { Realm } from "realm";

export const useTransactionDetail = () => {
  const realm = useRealm();

  const createTransactionDetail = (
    trxId: string,
    serviceId: string,
    qty: number,
    price: number,
    subtotal: number,
    description?: string
  ) => {
    let insertedId;
    realm.write(() => {
      const newDetail = realm.create(TransactionDetail, {
        _id: new Realm.BSON.ObjectId(),
        trxId,
        serviceId: new Realm.BSON.ObjectId(serviceId),
        qty,
        price,
        subtotal,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      insertedId = newDetail._id;
    });
    return insertedId;
  };

  const createMultipleTransactionDetail = (detailsArray: any[]) => {
    try {
      realm.write(() => {
        detailsArray.forEach((detail) => {
          realm.create(TransactionDetail, {
            trxId: detail.trxId,
            serviceId: new Realm.BSON.ObjectId(detail.serviceId),
            qty: detail.qty,
            price: detail.price,
            subtotal: detail.subtotal,
            description: detail.description,
          });
        });
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const getTransactionDetailsByTrxId = (trxId: string) => {
    return realm.objects(TransactionDetail).filtered("trxId == $0", trxId);
  };

  const updateTransactionDetail = (
    id: string,
    updates: Partial<TransactionDetail>
  ) => {
    realm.write(() => {
      const detail = realm.objectForPrimaryKey(
        TransactionDetail,
        new Realm.BSON.ObjectId(id)
      );
      if (detail) {
        Object.assign(detail, updates, { updatedAt: new Date() });
      }
    });
  };

  const deleteTransactionDetail = (id: string) => {
    realm.write(() => {
      const detail = realm.objectForPrimaryKey(
        TransactionDetail,
        new Realm.BSON.ObjectId(id)
      );
      if (detail) {
        realm.delete(detail);
      }
    });
  };

  const getCartDataByUserAndService = (userId: string, serviceId: string) => {
    return realm
      .objects(Cart)
      .filtered(
        "userId == $0 AND serviceId == $1",
        new Realm.BSON.ObjectId(userId),
        new Realm.BSON.ObjectId(serviceId)
      );
  };

  return {
    createTransactionDetail,
    createMultipleTransactionDetail,
    getTransactionDetailsByTrxId,
    updateTransactionDetail,
    deleteTransactionDetail,
    getCartDataByUserAndService,
  };
};
