import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/User";
import CommentDream, { ICommentDream } from "../models/CommentDream";
import Dream from "../models/Dream";

export interface commentCtrlType {
  // getLastCommentPost: (req: Request, res: Response) => void;
  createComment: (req: Request, res: Response) => void;
  getAllCommentsFromDreamCard: (req: Request, res: Response) => void;
  removeCommentDream: (req: Request, res: Response) => void;
  editCommentDream: (req: Request, res: Response) => void;
}

//Const
const commentCtrl: commentCtrlType = {
  createComment: async (req: Request, res: Response) => {
    try {
      const { father, type, userMail, comment } = req.body;
      console.log("req.query", req.body);
      console.log({
        father: father,
        type: type,
        comment: comment,
        userMail: userMail,
      });
      if (
        typeof father !== "string" ||
        typeof type !== "string" ||
        typeof userMail !== "string"
      ) {
        console.log({
          father: father,
          type: type,
          comment: comment,
          userMail: userMail,
        });
        return res.status(400).send("argument must be a string.");
      }
      const userFound = await User.findOne({ mail: userMail });
      if (!userFound)
        return res
          .status(401)
          .send(
            "No user found on 'createComment', review the mail or try again later"
          );
      //
      let fatherFound;
      let newComment;
      if (type === "dream") {
        fatherFound = await Dream.findById(father);
        if (!fatherFound)
          return res
            .status(401)
            .send(
              "No dream found on 'createComment', review the dream_id or try again later"
            );
        newComment = new CommentDream(comment);
        newComment.user = userFound._id as mongoose.Types.ObjectId;
        newComment.dream = fatherFound._id as mongoose.Types.ObjectId;
        console.log("newComment: ", newComment);
      }
      if (!newComment)
        return res.status(401).send({
          message:
            "NewComment was not created, review the info provided or try again later",
          ok: false,
        });
      const commentSaved = await newComment.save();
      if (!commentSaved)
        return res.status(401).send({
          message:
            "No comment saved on 'createComment', review the info provided or try again later",
          ok: false,
        });
      console.log(commentSaved);
      return res.status(201).send({
        data: commentSaved,
        message: "New comment created 😎",
        ok: true,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        return res.status(401).send({
          error: e,
          message: e.message,
          ok: false,
        });
        // throw new Error(e.message);
      } else {
        console.error(e);
        return res.status(401).send({
          error: e,
          message: "An unexpected error has occurred, please try again later.",
          ok: false,
        });
        throw new Error(
          "An unexpected error has occurred, please try again later."
        );
        // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
      }
    }
  },
  getAllCommentsFromDreamCard: async (req: Request, res: Response) => {
    try {
      const { dreamId } = req.query;
      console.log("dreamId:", dreamId);
      console.log("typeof dreamId:", typeof dreamId);
      if (!dreamId)
        return res.status(401).send({
          message: "No dreamId, provided to handle this request",
          ok: false,
        });
      if (typeof dreamId !== "string")
        return res.status(401).send({
          message: "dreamId, must be a string",
          ok: false,
        });
      const foundAllComments = await CommentDream.find({
        dream: dreamId,
      }).populate("user");
      console.log("foundAllComments", foundAllComments);
      if (!foundAllComments)
        return res.status(401).send({
          message:
            "No dreams found to send, please review the dreamId and try again",
          ok: false,
        });
      return res.status(201).send({
        data: foundAllComments,
        message: "New comment created 😎",
        ok: true,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        return res.status(401).send({
          error: e,
          message: e.message,
          ok: false,
        });
        // throw new Error(e.message);
      } else {
        console.error(e);
        return res.status(401).send({
          error: e,
          message: "An unexpected error has occurred, please try again later.",
          ok: false,
        });
      }
    }
  },
  removeCommentDream: async (req: Request, res: Response) => {
    try {
      const { commentId } = req.body; // Desestructurar correctamente el cuerpo de la solicitud
      console.log("commentId", commentId);
      if (!commentId) {
        return res.status(401).send({
          error: "No commentId in req.body", // Corregir mensaje de error
        });
      }
      const commentRemoved = await CommentDream.findByIdAndDelete(commentId);
      if (!commentRemoved) {
        return res.status(401).send({
          error: "comment not removed, please review Id and try again",
        });
      }
      return res.status(201).send({
        message: "Comment was removed",
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        return res.status(401).send({
          error: e,
          message: e.message,
          ok: false,
        });
        // throw new Error(e.message);
      } else {
        console.error(e);
        return res.status(401).send({
          error: e,
          message: "An unexpected error has occurred, please try again later.",
          ok: false,
        });
      }
    }
  },
  editCommentDream: async (req: Request, res: Response) => {
    const { comment } = req.body;
    console.log("editCommentDream is running")
    console.log("comment", comment)
    if (!comment) {
      return res.status(401).send({ error: "No comment in req.body" });
    }
    if (typeof comment !== "object") {
      return res.status(401).send({ error: "comment is not a object" });
    }
    if (!comment._id) {
      return res.status(401).send({ error: "No comment ID provided" });
    }

    try {
      const updateFields: Partial<ICommentDream> = {};
      if (comment.visibility !== undefined)
        updateFields.visibility = comment.visibility;
      if (comment.image !== undefined) updateFields.image = comment.image;
      if (comment.replayTo !== undefined)
        updateFields.replayTo = comment.replayTo;
      if (comment.isSubComment !== undefined)
        updateFields.isSubComment = comment.isSubComment;
      if (comment.comment !== undefined) updateFields.comment = comment.comment;

      const commentUpdated = await CommentDream.findByIdAndUpdate(
        comment._id,
        { $set: updateFields },
        { new: true }
      ).populate("user");

      if (!commentUpdated) {
        return res
          .status(401)
          .send({
            error: "Comment not updated, please review Id and try again",
          });
      }

      return res.status(201).send({
        data: commentUpdated,
        message: "Comment was updated successfully",
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        return res.status(500).send({
          error: e,
          message: e.message,
          ok: false,
        });
        // throw new Error(e.message);
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

export default commentCtrl;