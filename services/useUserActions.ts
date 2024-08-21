import { Realm, useRealm } from "@realm/react";
import { User } from "@/schemes/UserScheme"; // Adjust the import path accordingly
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";

export const useUserActions = () => {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const realm = useRealm();

  // Create a new user
  const createUser = (user: any) => {
    try {
      realm.write(() => {
        realm.create(User, {
          ...user,
        });
      });
      return true;
    } catch (error) {
      console.error("Failed to create user:", error);
      return false;
    }
  };

  // Read/Get a user by ID
  const getUserById = (userId: string) => {
    return realm.objectForPrimaryKey(User, new Realm.BSON.ObjectId(userId));
  };

  // Update a user
  const updateUser = (userId: string, updatedData: Partial<User>) => {
    try {
      realm.write(() => {
        const user = realm.objectForPrimaryKey(
          User,
          new Realm.BSON.ObjectId(userId)
        );
        if (user) {
          user.updatedAt = new Date();
          if (updatedData.name) user.name = updatedData.name;
          if (updatedData.email) user.email = updatedData.email;
          // Add other fields as needed
        }
      });
      return true;
    } catch (error) {
      console.error("Failed to update user:", error);
      return false;
    }
  };

  // Delete a user by ID
  const deleteUser = (userId: string) => {
    try {
      realm.write(() => {
        const user = realm.objectForPrimaryKey(
          User,
          new Realm.BSON.ObjectId(userId)
        );
        if (user) {
          realm.delete(user);
        }
      });
      return true;
    } catch (error) {
      console.error("Failed to delete user:", error);
      return false;
    }
  };

  // Read/Get all users
  const getAllUsers = () => {
    return realm.objects(User);
  };

  return {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllUsers,
  };
};
