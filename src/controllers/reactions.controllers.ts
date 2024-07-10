import { Request, Response } from "express";
import Reaction from "../models/Reaction";

export interface reactionsCtrlType {
  newReaction: (req: Request, res: Response) => void;
  getAllReactionsFromThisDream: (req: Request, res: Response) => void;
  isThisPostLikedByTheUser: (req: Request, res: Response) => void;
  removeReaction: (req: Request, res: Response) => void;
}

//Const
const reactionsCtrl: reactionsCtrlType = {
    newReaction: async (req: Request, res: Response) => {
    try {
      const { reaction } = req.body;
      console.log("req.query", req.body);
      console.log({
        reaction: reaction,
      });
      if (!reaction) {
        return res.status(400).send("reaction is required to create reaction");
      }
      if (typeof reaction !== "object") {
        return res.status(400).send("reaction must be an object.");
      }
      const newObjOfReaction = new Reaction(reaction);
      console.log("newObjOfReaction", newObjOfReaction);
      const savedReaction = await (await newObjOfReaction.save()).populate("user");
      console.log("savedReaction", savedReaction);
      if (!savedReaction) {
        return res.status(400).send({error: "Reaction could not being saved", message: savedReaction});
      }
      return res.status(201).send({
        data: savedReaction,
        message: "Reaction created 😎",
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
        // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
      }
    }
  },
  getAllReactionsFromThisDream: async (req: Request, res: Response) => {
    try {
      const { dreamId } = req.query;
      console.log("req.query", req.query);
      console.log({
        dreamId: dreamId,
      });
      if (!dreamId) {
        return res.status(400).send("DreamId is required to create reaction");
      }
      if (typeof dreamId !== "string") {
        return res.status(400).send("dreamId must be a string.");
      }
      const findAllReactionsToDream = await Reaction.find({dream: dreamId}).populate("user")
      console.log("findAllReactionsToDream", findAllReactionsToDream);
      if (!findAllReactionsToDream) {
        return res.status(400).send({
            ok: false,
            message: "Request was wrong, please review the dreamId"
        });
      }
      if (findAllReactionsToDream.length <= 0) {
        return res.status(200).send({
            ok: false,
            message: "No reactions on this item..."
        });
      }
      return res.status(201).send({
        data: findAllReactionsToDream,
        message: "Reactions found 😎",
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
        // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
      }
    }
  },
  isThisPostLikedByTheUser: async (req: Request, res: Response) => {
    try {
      const { objectId, userId, type } = req.query;
      console.log("req.query", req.query);
      console.log({
        objectId: objectId,
        userId: userId,
        type: type,
      });
      if (!objectId) {
        return res.status(400).send("objectId is required to create reaction");
      }
      if (typeof objectId !== "string" || typeof userId !== "string" || typeof type !== "string") {
        return res.status(400).send("ObjectId, UserID and Type must be a string.");
      }
      let findReaction = null
      if(type === "dream"){
        console.log("running dream...");
        findReaction = await Reaction.findOne({dream: objectId, user: userId}).populate("user")
        console.log("findReaction", findReaction);
      } else if(type === "post"){
        findReaction = await Reaction.findOne({post: objectId, user: userId}).populate("user")
      } else if(type === "comment"){
        findReaction = await Reaction.findOne({comment: objectId, user: userId}).populate("user")
      } else if(type === "message"){
        findReaction = await Reaction.findOne({message: objectId, user: userId}).populate("user")
      }
      console.log("findReaction", findReaction);
      if (!findReaction) {
        return res.status(201).send({
            ok: false,
            message: "Reaction could not be found, please review the dreamId"
        });
      }
      return res.status(201).send({
        data: findReaction,
        message: "Reactions found 😎",
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
        // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
      }
    }
  },
  removeReaction: async (req: Request, res: Response) => {
    try {
      const { reactionId } = req.query;
      console.log("req.query", req.query);
      console.log({
        objectId: reactionId,
      });
      if (!reactionId) {
        return res.status(400).send("reactionId is required to create reaction");
      }
      if (typeof reactionId !== "string") {
        return res.status(400).send("reactionId must be a string.");
      }
      let findReaction = await Reaction.findByIdAndDelete(reactionId)
      console.log("findReaction", findReaction);
      if (!findReaction) {
        return res.status(201).send({
            ok: false,
            message: "Reaction not liked at first time, can't unliked"
        });
      }
      return res.status(201).send({
        data: findReaction,
        message: "Reaction removed 😎",
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
        // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
      }
    }
  },
};

export default reactionsCtrl;
