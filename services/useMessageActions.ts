import Realm from "realm";
import { useRealm } from "@realm/react";
import { Message } from "@/schemes/MessageScheme";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";

export const useMessageActions = () => {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const realm = useRealm();

  // Create a new message
  const createMessage = (messageData: {
    title: string;
    message: string;
    sender?: Realm.BSON.ObjectId;
    receiver?: Realm.BSON.ObjectId;
  }) => {
    try {
      realm.write(() => {
        realm.create(Message, {
          title: messageData.title,
          message: messageData.message,
          sender: messageData?.sender || userId,
          receiver: messageData?.receiver || userId,
          status: 1,
          type: 1,
        });
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Update the status of a message
  const updateMessageStatus = (messageId: string, newStatus: number) => {
    realm.write(() => {
      const message = realm
        .objects(Message)
        .filtered("_id == $0", new Realm.BSON.ObjectId(messageId))[0];
      if (message) {
        message.status = newStatus;
        message.updatedAt = new Date();
      }
    });
  };

  // Delete a message
  const deleteMessage = (messageId: string) => {
    realm.write(() => {
      const message = realm
        .objects(Message)
        .filtered("_id == $0", new Realm.BSON.ObjectId(messageId))[0];
      if (message) {
        realm.delete(message);
      }
    });
  };

  // Get messages by sender or receiver
  const getMessages = (userId: string, isSender: boolean = true) => {
    const filterKey = isSender ? "sender" : "receiver";
    return realm
      .objects(Message)
      .filtered(`${filterKey} == $0`, new Realm.BSON.ObjectId(userId));
  };

  return {
    createMessage,
    updateMessageStatus,
    deleteMessage,
    getMessages,
  };
};
