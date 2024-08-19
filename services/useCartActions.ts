import { Cart } from "@/schemes/CartScheme";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Realm, useRealm } from "@realm/react";

export const useCartActions = () => {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const realm = useRealm();
  const userId = new Realm.BSON.ObjectId(profile?._id);

  const addToCart = (service: any) => {
    realm.write(() => {
      realm.create("Cart", {
        _id: new Realm.BSON.ObjectId(),
        serviceId: new Realm.BSON.ObjectId(service?._id),
        userId,
        title: service.title,
        description: service.description,
        notes: service.notes,
        price: service.price,
        qty: 1,
      });
    });
  };

  const incrementQuantity = (serviceId: string) => {
    realm.write(() => {
      const item = realm
        .objects(Cart)
        .filtered("serviceId == $0", serviceId)[0];
      if (item) {
        item.qty += 1;
      }
    });
  };

  const decrementQuantity = (serviceId: string) => {
    realm.write(() => {
      const item = realm
        .objects(Cart)
        .filtered("serviceId == $0", serviceId)[0];
      if (item && item.qty > 1) {
        item.qty -= 1;
      } else if (item && item.qty === 1) {
        realm.delete(item); // Remove item from cart if quantity reaches 0
      }
    });
  };

  const getQuantity = (serviceId: string) => {
    const item = realm
      .objects(Cart)
      .filtered("userId == $0 AND serviceId == $1", userId, serviceId)[0];
    return item ? item.qty : 0;
  };

  const getTotalQuantity = (serviceId: string) => {
    const items = realm
      .objects(Cart)
      .filtered("userId == $0 AND serviceId == $1", userId, serviceId);
    return items.reduce((total, item) => total + item.qty, 0);
  };

  const getTotalPrice = (serviceId: string) => {
    const items = realm
      .objects(Cart)
      .filtered("userId == $0 AND serviceId == $1", userId, serviceId);
    return items.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const getTotalPriceByUser = () => {
    const items = realm.objects(Cart).filtered("userId == $0", userId);
    return items.reduce((total, item) => total + item.price * item.qty, 0);
  };

  return {
    addToCart,
    incrementQuantity,
    decrementQuantity,
    getQuantity,
    getTotalQuantity,
    getTotalPrice,
    getTotalPriceByUser,
  };
};
