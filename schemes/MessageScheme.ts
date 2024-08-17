import Realm from "realm";

export class Message extends Realm.Object<Message> {
  id!: Realm.BSON.ObjectId;
  message!: string;
  sender!: Realm.BSON.ObjectId;
  receiver!: Realm.BSON.ObjectId;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      message: "string",
      sender: "objectId",
      receiver: "objectId",
      createdAt: { type: "date", default: () => new Date() },
    },
  };
}

export const messageScheme = [Message];
