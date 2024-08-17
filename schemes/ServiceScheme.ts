import Realm from "realm";

export class Service extends Realm.Object<Service> {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  description?: string;
  price!: number;
  category!: number;
  groupRefId?: Realm.BSON.ObjectId;

  static schema: Realm.ObjectSchema = {
    name: "Service",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      title: "string",
      description: "string?",
      price: "double",
      category: { type: "int" },
      groupRefId: "objectId?",
    },
  };
}

export const serviceScheme = [Service];
