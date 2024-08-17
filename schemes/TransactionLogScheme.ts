import Realm from "realm";

export class TransactionLog extends Realm.Object<TransactionLog> {
  _id!: Realm.BSON.ObjectId;
  trxId!: string;
  status!: number;
  requesterId!: Realm.BSON.ObjectId;
  responderId!: Realm.BSON.ObjectId;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: "TransactionLog",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      trxId: "string",
      status: "int",
      requesterId: "objectId",
      responderId: "objectId",
      createdAt: { type: "date", default: () => new Date() },
      updatedAt: { type: "date", default: () => new Date() },
    },
  };
}

export const trxLogScheme = [TransactionLog];
