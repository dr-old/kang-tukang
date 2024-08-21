import { Realm, useRealm } from "@realm/react";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Service } from "@/schemes/ServiceScheme";

export const useServiceActions = () => {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const realm = useRealm();

  // Create a new service
  const createService = (serviceData: Partial<Service>) => {
    try {
      realm.write(() => {
        realm.create("Service", {
          ...serviceData,
        });
      });
      return true;
    } catch (error) {
      console.error("Failed to create service:", error);
      return false;
    }
  };

  // Create multiple services
  const createMultipleServices = (servicesData: Partial<Service>[]) => {
    try {
      realm.write(() => {
        servicesData.forEach((data) => {
          const _id = new Realm.BSON.ObjectId();
          realm.create(Service, {
            _id,
            groupId: data?.groupId == "" ? _id.toString() : data?.groupId,
            ...data,
          });
        });
      });
      return true;
    } catch (error) {
      console.error("Failed to create multiple services:", error);
      return false;
    }
  };

  // Read/Get a service by ID
  const getServiceById = (serviceId: string) => {
    return realm.objectForPrimaryKey(
      Service,
      new Realm.BSON.ObjectId(serviceId)
    );
  };

  // Read/Get all services
  const getAllServices = () => {
    return realm.objects<Service>("Service");
  };

  // Read/Get all services
  const getServiceByCategory = (category: number) => {
    return realm.objects(Service).filtered("category == $0", category);
  };

  // Update a service
  const updateService = (serviceId: string, updatedData: Partial<Service>) => {
    try {
      realm.write(() => {
        const service = realm.objectForPrimaryKey<Service>(
          "Service",
          new Realm.BSON.ObjectId(serviceId)
        );
        if (service) {
          Object.assign(service, updatedData);
          service.updatedAt = new Date(); // Update the timestamp
        }
      });
      return true;
    } catch (error) {
      console.error("Failed to update service:", error);
      return false;
    }
  };

  // Delete a service by ID
  const deleteService = (serviceId: string) => {
    try {
      realm.write(() => {
        const service = realm.objectForPrimaryKey<Service>(
          "Service",
          new Realm.BSON.ObjectId(serviceId)
        );
        if (service) {
          realm.delete(service);
        }
      });
      return true;
    } catch (error) {
      console.error("Failed to delete service:", error);
      return false;
    }
  };

  return {
    createService,
    createMultipleServices,
    getServiceById,
    getServiceByCategory,
    getAllServices,
    updateService,
    deleteService,
  };
};
