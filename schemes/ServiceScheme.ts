import Realm from "realm";

export class Service extends Realm.Object<Service> {
  _id!: Realm.BSON.ObjectId;
  category!: number;
  createdAt!: Date;
  description!: string;
  groupId!: string;
  price!: number;
  title!: string;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: "Service",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      category: "int",
      description: "string",
      groupId: "string?",
      price: "double",
      title: "string",
      createdAt: { type: "date", default: () => new Date() },
      updatedAt: { type: "date", default: () => new Date() },
    },
    primaryKey: "_id",
  };
}

export const serviceScheme = [Service];
