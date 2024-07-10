import { Request, Response } from "express";
import Message, { IMessage } from "../models/Message";
import User from "../models/User";
import mapUsersSocket from "../helpers/mapUsersIdSocket";
import { io } from "..";
import mongoose from "mongoose";

export interface conversationsCtrlType {
  getConversationMessages: (req: Request, res: Response) => void;
  createMessage: (req: Request, res: Response) => void;
  editMessage: (req: Request, res: Response) => void;
  removeMessage: (req: Request, res: Response) => void;
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

      if (!message?.conversation) {
        return res.status(404).send({
          error: "The new message must have a conversationID",
          message: "The new message must have a conversationID",
          ok: false,
        });
      }
      if (!message?.fromUser || !message?.receiverUser) {
        return res.status(404).send({
          error: "The new message must have the sender and receiver ID",
          message: "The new message must have the sender and receiver ID",
          ok: false,
        });
      }

      const newMessage = new Message(message);
      const savedMessage = await newMessage.save();
      //Populate user who create the message
      await savedMessage.populate("fromUser")
      if (!savedMessage) {
        return res.status(404).send({
          error: savedMessage,
          message: "New message could not be saved, review the error.",
          ok: false,
        });
      }
      //CONECTION WITH SOCKET IO
      const receiverSocketId = mapUsersSocket[savedMessage.receiverUser as unknown as string];
      if (receiverSocketId) {
        console.log("New message by socket io send it")
        io.to(receiverSocketId).emit("receiveMessage", savedMessage);
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
      const  message  = req.body;
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
        editedMessage = await Message.findByIdAndUpdate(message._id, message);
        if (!editedMessage) {
          return res.status(404).send({
            error: editedMessage,
            message: "Message could not be edited, review the error logs.",
            ok: false,
          });
        }
        return res.status(200).send({
          data: editedMessage,
          message: "Message content was modified correctly",
          ok: true,
        });
      }
      if (message?.removed?.forAll !== identifyMessage?.removed.forAll) {
        editedMessage = await Message.findByIdAndUpdate(message._id, message);
        if (!editedMessage) {
          return res.status(404).send({
            error: editedMessage,
            message:
              "Message could not be removed for all, review the error logs.",
            ok: false,
          });
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
          message?.removed?.for.lenght !== identifyMessage?.removed.for.length
        ) {
          editedMessage = await Message.findByIdAndUpdate(message._id, message);
          if (!editedMessage) {
            return res.status(404).send({
              error: editedMessage,
              message:
                "Message could not be removed for the selected users, review the error logs.",
              ok: false,
            });
          }
          return res.status(200).send({
            data: editedMessage,
            message: `Message removed`,
            ok: true,
          });
        }
      }
      console.log("Messagge updated from user and conversation ERROR");
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
  removeMessage: async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).send({
          message: "id must be a string.",
          ok: false,
        });
      }

      const removedMessage = await Message.findByIdAndDelete(id);
      if (!removedMessage) {
        return res.status(404).send({
          error: removedMessage,
          message: "The message could not be removed, review the error.",
          ok: false,
        });
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
