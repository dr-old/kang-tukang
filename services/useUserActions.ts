import { Realm, useRealm } from "@realm/react";
import { User } from "@/schemes/UserScheme"; // Adjust the import path accordingly
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";

export const useUserActions = () => {
  const { setProfile } = useUserStore() as unknown as UserStoreType;
  const realm = useRealm();

  const handleProfile = (user: any) => {
    setProfile({
      _id: user._id,
      birthday: user.birthday,
      createdAt: user.createdAt,
      email: user.email,
      name: user.name,
      phone: user.phone,
      photo: user.photo,
      address: user.address,
      role: user.role,
      updatedAt: user.updatedAt,
    });
  };

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
          if (updatedData.phone) user.phone = updatedData.phone;
          if (updatedData.password) user.password = updatedData.password;
          if (updatedData.address) user.address = updatedData.address;
          if (updatedData.photo) user.photo = updatedData.photo;
          // Add other fields as needed
          handleProfile(user);
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
