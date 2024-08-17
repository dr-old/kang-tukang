import Realm from "realm";

export class TransactionDetail extends Realm.Object<TransactionDetail> {
  _id!: Realm.BSON.ObjectId;
  trxId!: string;
  serviceId!: Realm.BSON.ObjectId;
  qty!: number;
  subtotal!: number;
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: "Transaction",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      trxId: "string",
      serviceId: "objectId",
      qty: "int",
      subtotal: "double",
      description: "string?",
      createdAt: { type: "date", default: () => new Date() },
      updatedAt: { type: "date", default: () => new Date() },
    },
  };
}

export const trxDetailScheme = [TransactionDetail];
