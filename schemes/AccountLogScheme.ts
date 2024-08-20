import Realm from "realm";

export class AccountLog extends Realm.Object<AccountLog> {
  _id!: Realm.BSON.ObjectId;
  accountId!: Realm.BSON.ObjectId;
  accountType!: number;
  createdAt!: Date;
  status!: number;
  balance!: number;
  userId!: Realm.BSON.ObjectId;

  static schema: Realm.ObjectSchema = {
    name: "AccountLog",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      accountId: "objectId",
      accountType: "int",
      status: "int",
      balance: "double",
      userId: "objectId",
      createdAt: { type: "date", default: () => new Date() },
    },
  };
}

export const accountLogScheme = [AccountLog];
