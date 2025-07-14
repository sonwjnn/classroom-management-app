import express from "express";
import {
  getDocs,
  limit,
  orderBy,
  query,
  where,
  getDoc,
  doc,
  startAfter,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import responseHandler from "../handlers/response-handler";
import {
  conversationCollection,
  db,
  messageCollection,
  userCollection,
} from "../lib/firebase";
import { v4 as uuidv4 } from "uuid";

const DIRECT_MESSAGES_BATCH = 10;

const getMessagesByConversationId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { conversationId } = req.params;
    const { cursor } = req.query;

    if (!conversationId) {
      return responseHandler.badrequest(res, "Conversation ID is required");
    }

    let directMessages = [];
    let nextCursor = null;

    let messagesQuery = query(
      messageCollection,
      where("conversation_id", "==", conversationId),
      orderBy("created_at", "desc"),
      limit(DIRECT_MESSAGES_BATCH)
    );

    if (cursor) {
      const cursorSnapshot = await getDocs(
        query(messageCollection, where("id", "==", cursor), limit(1))
      );

      if (!cursorSnapshot.empty) {
        messagesQuery = query(
          messageCollection,
          where("conversation_id", "==", conversationId),
          orderBy("created_at", "desc"),
          startAfter(cursorSnapshot.docs[0]),
          limit(DIRECT_MESSAGES_BATCH)
        );
      }
    }

    const querySnapshot = await getDocs(messagesQuery);

    for (const docSnapshot of querySnapshot.docs) {
      const messageData = docSnapshot.data();

      let userData = null;
      if (messageData.user_id) {
        const userQuery = query(
          userCollection,
          where("id", "==", messageData.user_id)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          userData = userSnapshot.docs[0].data();
        }
      }

      directMessages.push({
        id: docSnapshot.id,
        ...messageData,
        user: userData,
        created_at: messageData.created_at?.toDate() || new Date(),
      });
    }

    if (directMessages.length === DIRECT_MESSAGES_BATCH) {
      nextCursor = directMessages[directMessages.length - 1].id;
    }

    responseHandler.ok(res, {
      items: directMessages,
      nextCursor,
    });
  } catch (error) {
    console.error("Error getting messages:", error);
    responseHandler.error(res);
  }
};

const findConversation = async (userOneId: string, userTwoId: string) => {
  try {
    const conversationSnapshot = await getDocs(
      query(
        conversationCollection,
        where("user_one_id", "==", userOneId),
        where("user_two_id", "==", userTwoId)
      )
    );

    if (conversationSnapshot.empty) {
      return null;
    }

    const conversation = conversationSnapshot.docs[0].data();

    return conversation;
  } catch {
    return null;
  }
};

const getOrCreateConversation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const user = req.user;
    const { userTwoId } = req.params;

    if (!user || !user.id) {
      return responseHandler.unauthorized(res);
    }

    if (!userTwoId) {
      return responseHandler.badrequest(res, "Target user ID missing");
    }

    const q = query(userCollection, where("id", "==", userTwoId));

    const userTwoSnapshot = await getDocs(q);

    if (userTwoSnapshot.empty) {
      return responseHandler.notfound(res, "User not found");
    }

    const userTwo = userTwoSnapshot.docs[0].data();

    let conversation =
      (await findConversation(user.id, userTwoId)) ||
      (await findConversation(userTwoId, user.id));

    if (!conversation) {
      const id = uuidv4();
      await setDoc(doc(conversationCollection), {
        id,
        user_one_id: user.id,
        user_two_id: userTwoId,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      return responseHandler.ok(res, {
        id,
        user_one_id: user.id,
        user_two_id: userTwoId,
        user_one: user,
        user_two: userTwo,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }

    return responseHandler.ok(res, {
      ...conversation,
      user_one: user,
      user_two: userTwo,
    });
  } catch (error) {
    console.error("Error getting student profile:", error);
    responseHandler.error(res);
  }
};

const createMessage = async (req: express.Request, res: express.Response) => {
  try {
    const { content, conversationId } = req.body;
    const user = req.user;

    if (!user || !conversationId || !content) {
      return responseHandler.notfound(res);
    }

    const q = query(conversationCollection, where("id", "==", conversationId));

    const conversationSnapshot = await getDocs(q);

    if (conversationSnapshot.empty) {
      return responseHandler.badrequest(res, "Conversation does not exist");
    }

    const newMessage = {
      id: uuidv4(),
      content,
      conversation_id: conversationId,
      user_id: user.id,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    await setDoc(doc(messageCollection), newMessage);

    const chatKey = `chat:${conversationId}:messages`;

    const payload = {
      ...newMessage,
      user: user,
      created_at: new Date(),
    };

    res?.app.get("io").emit(chatKey, payload);

    return responseHandler.ok(res, payload);
  } catch (error) {
    console.log(error);
    responseHandler.error(res);
  }
};

export default {
  getMessagesByConversationId,
  getOrCreateConversation,
  createMessage,
};
