import Realm from "realm";

export class Message extends Realm.Object<Message> {
  id!: Realm.BSON.ObjectId;
  title!: string;
  message!: string;
  sender!: Realm.BSON.ObjectId;
  receiver!: Realm.BSON.ObjectId;
  status!: number;
  type!: number;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      title: "string",
      message: "string",
      sender: "objectId",
      receiver: "objectId",
      status: "int",
      type: "int",
      createdAt: { type: "date", default: () => new Date() },
      updatedAt: { type: "date", default: () => new Date() },
    },
  };
}

export const messageScheme = [Message];
