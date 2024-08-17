import Realm from "realm";

export class Account extends Realm.Object<Account> {
  _id!: Realm.BSON.ObjectId;
  accountName!: string;
  accountType!: string;
  balance!: number;
  createdAt!: Date;
  updatedAt!: Date;
  userId!: Realm.BSON.ObjectId;

  static schema: Realm.ObjectSchema = {
    name: "Account",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      accountName: "string",
      accountType: "string",
      balance: "double",
      userId: "objectId",
      updatedAt: { type: "date", default: () => new Date() },
      createdAt: { type: "date", default: () => new Date() },
    },
  };
}

export const accountScheme = [Account];
