import Realm, { BSON } from "realm";

export class User extends Realm.Object<User> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  name!: string;
  email!: string;
  password!: string;
  phone!: string;
  photo!: string;
  birthday!: string;
  address!: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: "User",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new BSON.ObjectId() },
      name: "string?",
      email: "string",
      password: "string",
      phone: "string?",
      photo: "string?",
      birthday: "string?",
      address: "string?",
      role: { type: "string", default: "user" },
      createdAt: { type: "date", default: () => new Date() },
      updatedAt: { type: "date", default: () => new Date() },
    },
  };
}

export const userScheme = [User];
