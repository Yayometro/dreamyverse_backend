import { Request, Response } from "express";
import Message, { IMessage } from "../models/Message";
import User, { IUser } from "../models/User";
import mapUsersSocket from "../helpers/mapUsersIdSocket";
import { io } from "..";
import mongoose, { ObjectId } from "mongoose";
import {
  actionSocketMessage,
  MessageSocketObject,
  removeForHandleType,
} from "../../indexTypes";

export interface conversationsCtrlType {
  getConversationMessages: (req: Request, res: Response) => void;
  createMessage: (req: Request, res: Response) => void;
  editMessage: (req: Request, res: Response) => void;
  removeMessage: (req: Request, res: Response) => void;
  markAsRead: (req: Request, res: Response) => void;
}

const messageCtrl: conversationsCtrlType = {
  getConversationMessages: async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).send({
          message: "id must be a string.",
          ok: false,
        });
      }

      const conversatonalMessages = await Message.find({ conversation: id });
      if (!conversatonalMessages) {
        return res.status(404).send({
          error: conversatonalMessages,
          message: "Messages not obtained, review the error.",
          ok: false,
        });
      }

      return res.status(200).send({
        data: conversatonalMessages,
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
  createMessage: async (req: Request, res: Response) => {
    try {
      const message = req.body;
      if (typeof message !== "object") {
        return res.status(400).send({
          message: `message must be a object. Instead is a ${typeof message}`,
          ok: false,
        });
      }

      message as IMessage;
      console.log("message", message);
      if (!message?.conversation) {
        return res
          .status(404)
          .send("The new message must have a conversationID");
      }
      if (!message?.fromUser || !message?.receiverUser) {
        return res
          .status(404)
          .send("The new message must have the sender and receiver ID");
      }

      const newMessage = new Message(message);
      const savedMessage = await newMessage.save();
      //Populate user who create the message
      await savedMessage.populate("fromUser");
      if (!savedMessage) {
        return res.status(404).send({
          error: savedMessage,
          message: "New message could not be saved, review the error.",
          ok: false,
        });
      }
      //CONECTION WITH SOCKET IO
      const receiverSocketId =
        mapUsersSocket[savedMessage.receiverUser as unknown as string];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          iMessage: savedMessage as IMessage,
          action: "newMessage" as actionSocketMessage,
          message: undefined as unknown,
        } as MessageSocketObject);
      }

      return res.status(200).send({
        data: savedMessage,
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
  editMessage: async (req: Request, res: Response) => {
    try {
      const message = req.body;
      if (typeof message !== "object") {
        return res.status(400).send({
          message: "message must be a object.",
          ok: false,
        });
      }
      if (!message?._id) {
        return res.status(400).send({
          message: "message must have _id",
          ok: false,
        });
      }
      //Start update:
      let editedMessage;
      const identifyMessage = await Message.findById(message._id);
      if (!identifyMessage) {
        return res.status(404).send({
          error: identifyMessage,
          message:
            "Message origin could not be identified, review the error logs.",
          ok: false,
        });
      }
      const identifyAutor = await User.findById(message.fromUser);
      if (!identifyAutor) {
        return res.status(404).send({
          error: identifyAutor,
          message:
            "The autor of the message could not be identified, review the error logs.",
          ok: false,
        });
      }
      //Content verification
      if (
        message?.content?.message !== identifyMessage?.content.message ||
        message?.content?.media !== identifyMessage?.content.media
      ) {
        editedMessage = await Message.findByIdAndUpdate(
          message._id,
          message
        ).populate("fromUser");
        if (!editedMessage) {
          return res.status(404).send({
            error: editedMessage,
            message: "Message could not be edited, review the error logs.",
            ok: false,
          });
        }
        //CONECTION WITH SOCKET IO
        const receiverSocketId =
          mapUsersSocket[editedMessage.receiverUser as unknown as string];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", {
            iMessage: editedMessage as IMessage,
            action: "editContent" as actionSocketMessage,
            message: `${identifyAutor.username} edited the content of one message in your conversation 👀`,
          } as MessageSocketObject);
        }
        return res.status(200).send({
          data: editedMessage,
          message: "Message content was modified correctly",
          ok: true,
        });
      }
      if (message?.removed?.forAll !== identifyMessage?.removed.forAll) {
        editedMessage = await Message.findByIdAndUpdate(
          message._id,
          message
        ).populate("fromUser");
        if (!editedMessage) {
          return res.status(404).send({
            error: editedMessage,
            message:
              "Message could not be removed for all, review the error logs.",
            ok: false,
          });
        }
        //CONECTION WITH SOCKET IO
        const receiverSocketId =
          mapUsersSocket[editedMessage.receiverUser as unknown as string];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", {
            iMessage: editedMessage as IMessage,
            action: "removeForAll" as actionSocketMessage,
            message: `${identifyAutor.username} remove one message permanently 🫢`,
          } as MessageSocketObject);
        }
        return res.status(200).send({
          data: editedMessage,
          message:
            "The message was removed for all participants in this conversation.",
          ok: true,
        });
      }
      if (message?.removed?.for && identifyMessage?.removed.for) {
        if (
          message?.removed?.for.length !== identifyMessage?.removed.for.length
        ) {
          editedMessage = await Message.findByIdAndUpdate(
            message._id,
            message
          ).populate("fromUser");
          if (!editedMessage) {
            return res.status(404).send({
              error: editedMessage,
              message:
                "Message could not be removed for the selected users, review the error logs.",
              ok: false,
            });
          }
          //CONECTION WITH SOCKET IO
          let definingTypeAction;
          let definingMessage;
          if (message?.type as removeForHandleType) {
            if (
              (message.type as removeForHandleType) === "RemovedForMyselfOnly"
            ) {
              definingTypeAction = "removeFor" as actionSocketMessage;
              definingMessage = `${identifyAutor.username} removed one message for him/her only.`;
            } else if (
              (message.type as removeForHandleType) === "RestoredForMyself"
            ) {
              definingTypeAction = "visibleAgain" as actionSocketMessage;
              definingMessage = `${identifyAutor.username} returned one message as visible again for him/her only`;
            } else if (
              (message.type as removeForHandleType) === "RemoveForTheOtherOnly"
            ) {
              definingTypeAction = "removeFor" as actionSocketMessage;
              definingMessage = `${identifyAutor.username} remove one message for you only 😬`;
            } else if (
              (message.type as removeForHandleType) === "RestoredForTheOther"
            ) {
              definingTypeAction = "visibleAgain" as actionSocketMessage;
              definingMessage = `${identifyAutor.username} returned one message as visible again for you 😏`;
            } else {
              definingTypeAction = "removeFor" as actionSocketMessage;
              definingMessage = `Message was removed or marked as visible again for ${identifyAutor.username}`;
            }
          }
          const receiverSocketId =
            mapUsersSocket[editedMessage.receiverUser as unknown as string];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", {
              iMessage: editedMessage as IMessage,
              action: definingTypeAction,
              message: definingMessage,
            } as MessageSocketObject);
          }
          return res.status(200).send({
            data: editedMessage,
            message: `Message removed`,
            ok: true,
          });
        }
      }
      //HANDLE MESSAGE UNREAD
      if (message.read !== identifyMessage.read) {
        editedMessage = await Message.findByIdAndUpdate(message._id, message);
        if (!editedMessage) {
          return res.status(404).send({
            error: editedMessage,
            message:
              "Message could not be marked as read. Review the error logs.",
            ok: false,
          });
        }
        return res.status(200).send({
          data: editedMessage,
          message: `Message marked as read`,
          ok: true,
        });
      }
      //SAVE
      editedMessage = await Message.findByIdAndUpdate(message._id, message);
      if (!editedMessage) {
        return res.status(404).send({
          error: editedMessage,
          message: "New message could not be updated, review the error.",
          ok: false,
        });
      }

      return res.status(200).send({
        data: editedMessage,
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
  markAsRead: async (req: Request, res: Response) => {
    try {
      const messages = req.body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).send({
          message: "Messages must be a non-empty array.",
          ok: false,
        });
      }
      // Update messages
      const updatedMessages = await Message.updateMany(
        { _id: { $in: messages.map((m) => m) } },
        { $set: { read: true } }
      );
      if (!updatedMessages) {
        return res.status(404).send({
          error: updatedMessages,
          message:
            "Message origin could not be identified, review the error logs.",
          ok: false,
        });
      }

      return res.status(200).send({
        data: updatedMessages,
        message: "Messages were marked as read",
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
  removeMessage: async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).send({
          message: "id must be a string.",
          ok: false,
        });
      }

      const removedMessage = await Message.findByIdAndDelete(id).populate(
        "fromUser"
      );
      if (!removedMessage) {
        return res.status(404).send({
          error: removedMessage,
          message: "The message could not be removed, review the error.",
          ok: false,
        });
      }
      //CONECTION WITH SOCKET IO
      const receiverSocketId =
        mapUsersSocket[removedMessage.receiverUser as unknown as string];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          iMessage: removedMessage as IMessage,
          action: "removeForAll" as actionSocketMessage,
          message: `${
            !(removedMessage.fromUser as unknown as IUser).username
              ? "User"
              : (removedMessage.fromUser as unknown as IUser).username
          } remove one message for all 🙅‍♂️`,
        } as MessageSocketObject);
      }
      return res.status(200).send({
        data: removedMessage,
        message: "The message was removed completely",
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

export default messageCtrl;
