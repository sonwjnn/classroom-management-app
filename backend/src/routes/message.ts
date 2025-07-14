import express from "express";

import requestHandler from "../handlers/request-handler";
import { isAuthenticated } from "../middlewares/auth";
import messageController from "../controllers/message";

const router = express.Router({ mergeParams: true });

export default (): express.Router => {
  router.get(
    "/messages/conversation/:conversationId",
    isAuthenticated,
    requestHandler.validate,
    messageController.getMessagesByConversationId
  );

  router.get(
    "/conversation/user/:userTwoId",
    isAuthenticated,
    requestHandler.validate,
    messageController.getOrCreateConversation
  );

  router.post(
    "/messages/conversation",
    isAuthenticated,
    requestHandler.validate,
    messageController.createMessage
  );

  return router;
};
