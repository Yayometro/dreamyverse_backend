import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import { Types } from "mongoose";
import Message from "../models/Message";

export interface conversationsCtrlType {
  getAllUserConversations: (req: Request, res: Response) => void;
  createUserConversation: (req: Request, res: Response) => void;
  clearConversationForUser: (req: Request, res: Response) => void;
  editConversation: (req: Request, res: Response) => void;
  conversationAlreadyExist: (req: Request, res: Response) => void;
  getAllMessagesPerConversation: (req: Request, res: Response) => void;
}

const conversationsCtrl: conversationsCtrlType = {
  getAllUserConversations: async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).send({
          message: "id must be a string.",
          ok: false,
        });
      }
      const userId = id as unknown as Types.ObjectId;

      const findAllConversations = await Conversation.find({
        participants: { $in: [userId] },
        //$in operation find DOCS where the userID is present.
      }).populate("participants");

      if (!findAllConversations || findAllConversations.length === 0) {
        return res.status(201).send({
          data: findAllConversations,
          message: "No conversations found for the user.",
          ok: false,
        });
      }

      return res.status(200).send({
        data: findAllConversations,
        message: "User conversations found.",
        ok: true,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        return res.status(500).send({
          error: e,
          message: e.message,
          ok: false,
        });
      } else {
        console.error(e);
        return res.status(500).send({
          error: e,
          message: "An unexpected error has occurred, please try again later.",
          ok: false,
        });
      }
    }
  },
  clearConversationForUser: async (req: Request, res: Response) => {
    try {
      const { convId, userId } = req.query;
      if (typeof convId !== "string" && typeof userId !== "string") {
        return res.status(400).send({
          error: "id for conversation and user must be a string.",
          message: "id for conversation and user must be a string.",
          ok: false,
        });
      }
      const userObjectId = userId as unknown as Types.ObjectId;
      const findAllConversationsAndUpdateThem = await Message.updateMany(
        { conversation: convId },
        { $addToSet: { "removed.for": userObjectId } }
        //addToSet is an operator and helps to check if the userID is already inside in remove.for and if not, then adds the id.
      );

      console.log(
        "findAllConversationsAndUpdateThem",
        findAllConversationsAndUpdateThem
      );
      if (!findAllConversationsAndUpdateThem) {
        return res.status(404).send({
          error: findAllConversationsAndUpdateThem,
          message:
            "Something went wrong while we were clening this conversation, please try again later..",
          ok: false,
        });
      }

      return res.status(200).send({
        data: true,
        message:
          "The user removed all the conversation messages on it's side successfully 👌",
        ok: true,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        return res.status(500).send({
          error: e,
          message: e.message,
          ok: false,
        });
      } else {
        console.error(e);
        return res.status(500).send({
          error: e,
          message: "An unexpected error has occurred, please try again later.",
          ok: false,
        });
      }
    }
  },
  editConversation: async (req: Request, res: Response) => {
    try {
      const conversation = req.body;
      if (typeof conversation !== "object") {
        return res.status(400).send({
          message: "Invalid conversation data.",
          ok: false,
        });
      }
      if (
        !conversation?.participants ||
        !Array.isArray(conversation.participants)
      ) {
        return res.status(400).send({
          error: "Participants list is required.",
          message: "Participants list is required.",
          ok: false,
        });
      }
      if (conversation.participants.length <= 1) {
        return res.status(400).send({
          error: "The participants on a conversation must be at least 2.",
          message: "The participants on a conversation must be at least 2.",
          ok: false,
        });
      }

      let conversationUpdated;
      if (conversation.participants.length > 2) {
        conversationUpdated = await Conversation.findByIdAndUpdate(
          conversation._id,
          {
            participants: conversation.participants,
          }
        );
        if (!conversationUpdated) {
          return res.status(404).send({
            error: conversationUpdated,
            message:
              "Something went wrong while updating the conversation participants.",
            ok: false,
          });
        }
      }

      conversationUpdated = await Conversation.findByIdAndUpdate(
        conversation._id,
        {
          isBlocked: conversation?.isBlocked,
          isMuted: conversation?.isMuted,
        },
        { new: true }
      );

      if (!conversationUpdated) {
        return res.status(404).send({
          error: conversationUpdated,
          message:
            "Something went wrong while updating the conversation settings.",
          ok: false,
        });
      }

      return res.status(200).send({
        data: conversationUpdated,
        message: "Conversation updated successfully.",
        ok: true,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        return res.status(500).send({
          error: e,
          message: e.message,
          ok: false,
        });
      } else {
        console.error(e);
        return res.status(500).send({
          error: e,
          message: "An unexpected error has occurred, please try again later.",
          ok: false,
        });
      }
    }
  },
  createUserConversation: async (req: Request, res: Response) => {
    try {
      const conversation = req.body;
      if (typeof conversation !== "object") {
        return res.status(400).send({
          message: "No conversations found for the user.",
          ok: false,
        });
      }
      if (
        !conversation?.participants ||
        !Array.isArray(conversation.participants)
      ) {
        return res.status(400).send({
          error: "Participants list is required.",
          message: "Participants list is required.",
          ok: false,
        });
      }
      if (conversation.participants.lenght <= 1) {
        return res.status(404).send({
          error:
            "The participants on a conversation must be at least 2, please review the participant list an try again later.",
          message:
            "The participants on a conversation must be at least 2, please review the participant list an try again later.",
          ok: false,
        });
      }

      const newConversation = new Conversation(conversation);
      const savedConversation = await newConversation.save();
      if (!savedConversation) {
        return res.status(404).send({
          error: savedConversation,
          message:
            "Something went wrong trying to save the new conversation, review the error.",
          ok: false,
        });
      }
      return res.status(200).send({
        data: savedConversation,
        message: "New conversation created.",
        ok: true,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        return res.status(500).send({
          error: e,
          message: e.message,
          ok: false,
        });
      } else {
        console.error(e);
        return res.status(500).send({
          error: e,
          message: "An unexpected error has occurred, please try again later.",
          ok: false,
        });
      }
    }
  },
  conversationAlreadyExist: async (req: Request, res: Response) => {
    try {
      const { idOne, idTwo } = req.query;
      if (typeof idOne !== "string" || typeof idTwo !== "string") {
        return res.status(400).send({
          message: "IDs must be strings to know if the conversation already exists.",
          ok: false,
        });
      }
      const userIdOne = new Types.ObjectId(idOne);
      const userIdTwo = new Types.ObjectId(idTwo);
  
      const findConversation = await Conversation.aggregate([
        {
          $match: { //for future reference use $match to find all conversation where this users Ids are
            participants: { $all: [userIdOne, userIdTwo] }
          }
        },
        {
          $project: { //create a new filter variable in the pipline searcher. Where we create the size
            participants: 1,
            size: { $size: "$participants" }
          }
        },
        {
          $match: { //Here we update the size and said that select only the conversation where are 2 participants
            size: 2
          }
        }
      ]);
  
      if (findConversation.length === 0) {
        return res.status(200).send({
          data: 0,
          message: "This conversation between these two users does not exist already",
          ok: false,
        });
      }
  
      return res.status(200).send({
        data: findConversation[0],
        message: "Conversation exists",
        ok: true,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        return res.status(500).send({
          error: e,
          message: e.message,
          ok: false,
        });
      } else {
        console.error(e);
        return res.status(500).send({
          error: e,
          message: "An unexpected error has occurred, please try again later.",
          ok: false,
        });
      }
    }
  },
  getAllMessagesPerConversation: async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).send({
          message: "Id must be strings to know if the conversation already exists.",
          ok: false,
        });
      }
  
      const findAllConversationMessages = await Message.find({conversation: id}).populate("fromUser")
  
      if (findAllConversationMessages.length === 0) {
        return res.status(200).send({
          data: 0,
          message: "This conversation has no messages yet, be the first one to talk!",
          ok: false,
        });
      }
  
      return res.status(200).send({
        data: findAllConversationMessages,
        message: "Conversation messages get it",
        ok: true,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        return res.status(500).send({
          error: e,
          message: e.message,
          ok: false,
        });
      } else {
        console.error(e);
        return res.status(500).send({
          error: e,
          message: "An unexpected error has occurred, please try again later.",
          ok: false,
        });
      }
    }
  },
  
  

};

export default conversationsCtrl;
