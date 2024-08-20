import Realm from "realm";

export class Cart extends Realm.Object<Cart> {
  _id!: Realm.BSON.ObjectId;
  createdAt!: Date;
  description!: string;
  notes?: string;
  price!: number;
  qty!: number;
  category!: number;
  serviceId!: Realm.BSON.ObjectId;
  title!: string;
  updatedAt!: Date;
  userId!: Realm.BSON.ObjectId;

  static schema: Realm.ObjectSchema = {
    name: "Cart",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      createdAt: { type: "date", default: () => new Date() },
      description: "string",
      notes: "string?",
      price: "double",
      qty: "int",
      category: "int",
      serviceId: "objectId",
      title: "string",
      updatedAt: { type: "date", default: () => new Date() },
      userId: "objectId",
    },
  };
}

export const cartScheme = [Cart];
