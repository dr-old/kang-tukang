import { BSON } from "realm";

export type ResponsePayloadType = {
  ok?: boolean;
  data?: any;
  error?: any;
};

export type OrderStoreType = {
  products?: any;
  orders?: any;
  order?: any;
  getProducts: (params?: any) => void;
  getOrders: (params?: any) => void;
  getOrder: (params?: any) => void;
  createOrder: (params?: any) => void;
  updateOrder: (params?: any) => void;
  deleteOrder: (params?: any) => void;
};

export type UserStoreType = {
  offlineMode?: boolean;
  setOfflineMode: (params?: any) => void;
  profile?: {
    _id: BSON.ObjectId;
    birthday: string;
    createdAt: Date;
    email: string;
    name: string;
    phone: string;
    photo: string;
    address: string;
    role: string;
    updatedAt: Date;
  };
  isLoggedIn?: boolean;
  setProfile: (params?: any) => void;
  setLogIn: (params?: any) => void;
};
