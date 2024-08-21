import Realm from "realm";

export class Transaction extends Realm.Object<Transaction> {
  _id!: Realm.BSON.ObjectId;
  userId!: Realm.BSON.ObjectId;
  trxId!: string;
  description?: string;
  totalPrice!: number;
  totalQty!: number;
  createdAt!: Date;
  updatedAt!: Date;
  status!: number;
  category!: number;
  handymanId!: string;

  static schema: Realm.ObjectSchema = {
    name: "Transaction",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      trxId: "string",
      description: "string?",
      totalPrice: "double",
      totalQty: "int",
      category: "int",
      userId: "objectId",
      createdAt: { type: "date", default: () => new Date() },
      updatedAt: { type: "date", default: () => new Date() },
      status: { type: "int", default: 1 },
      handymanId: { type: "string", default: "" },
    },
  };
}

export const trxScheme = [Transaction];
