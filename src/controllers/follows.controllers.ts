
import { Request, Response } from "express";
import Follow from "../models/Follow";

export interface reactionsCtrlType {
  newFollow: (req: Request, res: Response) => void;
  getUserFollowers: (req: Request, res: Response) => void;
  getListOfUsersFollowedByUser: (req: Request, res: Response) => void;
  removeFollow: (req: Request, res: Response) => void;
  getUsersFollowingDream: (req: Request, res: Response) => void;
  amIFollowingThisUser: (req: Request, res: Response) => void;
  amIFollowingThisDream: (req: Request, res: Response) => void;
}

//Const
const followsCtrl: reactionsCtrlType = {
  newFollow: async (req: Request, res: Response) => {
    try {
      const follow = req.body;
      console.log("req.query newFollow", req.body);
      console.log({
        follow: follow,
      });
      if (!follow) {
        return res.status(400).send("follow is required to create follow");
      }
      if (typeof follow !== "object") {
        return res.status(400).send("Follow must be an object.");
      }
      const newFollow = new Follow(follow);
      console.log("newFollow", newFollow);
      const savedFollow = await (await newFollow.save()).populate("follower");
      console.log("savedFollow", savedFollow);
      if (!savedFollow) {
        return res
          .status(400)
          .send({
            error: "Follow could not being saved",
            message: newFollow,
          });
      }
      return res.status(201).send({
        data: savedFollow,
        message: "Follow created 😎",
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
  getUserFollowers: async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      console.log("req.query", req.query);
      console.log({
        userId: userId,
      });
      if (!userId) {
        return res.status(400).send("userId is required to create follow");
      }
      if (typeof userId !== "string") {
        return res.status(400).send("userId must be a string.");
      }
      const findUserFollowers = await Follow.find({ user: userId }).populate(
        "follower"
      );
      console.log("findUserFollowers", findUserFollowers);
      if (!findUserFollowers) {
        return res
          .status(400)
          .send({
            error: "Unable to find user followers, please REVIEW THE USER ID",
            message: findUserFollowers,
          });
      }
      if (findUserFollowers.length <= 0) {
        return res.status(201).send({
            data: findUserFollowers,
            message: "No users following you",
            ok: false,
          });
      }
      return res.status(201).send({
        data: findUserFollowers,
        message: "Users followers found 😎",
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
  getListOfUsersFollowedByUser: async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      console.log("req.query", req.query);
      console.log({
        userId: userId,
      });
      if (!userId) {
        return res.status(400).send("userId is required to create follow");
      }
      if (typeof userId !== "string") {
        return res.status(400).send("userId must be a string.");
      }
      const findFollowsFromUser = await Follow.find({ 
        follower: userId, 
        $or: [
          { dream: { $exists: false } },
          { post: { $exists: false } }
        ]
      }).populate("user");
      console.log("findFollowsFromUser", findFollowsFromUser);
      if (!findFollowsFromUser) {
        return res
          .status(400)
          .send({
            error: "Unable to find user followers", 
            ok: false
          });
      }
      if (findFollowsFromUser.length <= 0) {
        return res.status(201).send({
            data: findFollowsFromUser,
            message: "User is following none",
            ok: false,
          });
      }
      return res.status(201).send({
        data: findFollowsFromUser,
        message: "List of users followed by the user, found 😎",
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
  getUsersFollowingDream: async (req: Request, res: Response) => {
    try {
      const { dreamId } = req.query;
      console.log("req.query", req.query);
      console.log({
        dreamId: dreamId,
      });
      if (!dreamId) {
        return res.status(400).send("dreamId is required to create follow");
      }
      if (typeof dreamId !== "string") {
        return res.status(400).send("dreamId must be a string.");
      }
      const findDreamFollowers = await Follow.find({ dream: dreamId }).populate(
        "follower"
      );
      console.log("findDreamFollowers", findDreamFollowers);
      if (!findDreamFollowers) {
        return res
          .status(400)
          .send({
            error: "Unable to find dreams users followers, please REVIEW THE USER ID",
            message: findDreamFollowers,
          });
      }
      if (findDreamFollowers.length <= 0) {
        return res.status(201).send({
            data: findDreamFollowers,
            message: "This dream is not being followed",
            ok: false,
          });
      }
      return res.status(201).send({
        data: findDreamFollowers,
        message: "List of dreams followers, found 😎",
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
  amIFollowingThisUser: async (req: Request, res: Response) => {
    try {
      const { follower, followed } = req.query;
      console.log("req.query", req.query);
      console.log({
        follower: follower,
        followed: followed
      });
      if (!follower) {
        return res.status(400).send("follower is required to create follow");
      }
      if (!followed) {
        return res.status(400).send("followed is required to create follow");
      }
      if (typeof follower !== "string") {
        return res.status(400).send("follower must be a string.");
      }
      if (typeof followed !== "string") {
        return res.status(400).send("followed must be a string.");
      }
      const amIFollowing = await Follow.findOne({ follower: follower, user: followed })
      console.log("amIFollowing", amIFollowing);
      if (!amIFollowing) {
        return res
          .status(201)
          .send({
            error: amIFollowing,
            message: "Unable to know if user is following him/her, please REVIEW THE USER ID",
            ok: false
          });
      }
      return res.status(201).send({
        data: amIFollowing,
        message: "Yes user is following, found 😎",
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
  amIFollowingThisDream: async (req: Request, res: Response) => {
    try {
      const { follower, followed } = req.query;
      console.log("req.query", req.query);
      console.log({
        follower: follower,
        followed: followed
      });
      if (!follower) {
        return res.status(400).send("follower is required to find follow");
      }
      if (!followed) {
        return res.status(400).send("followed is required to find follow");
      }
      if (typeof follower !== "string") {
        return res.status(400).send("follower must be a string.");
      }
      if (typeof followed !== "string") {
        return res.status(400).send("followed must be a string.");
      }
      const amIFollowing = await Follow.findOne({ follower: follower, dream: followed })
      console.log("amIFollowing", amIFollowing);
      if (!amIFollowing) {
        return res
          .status(201)
          .send({
            error: amIFollowing,
            message: "Unable to know if user is following dream, please REVIEW THE USER ID",
            ok: false
          });
      }
      return res.status(201).send({
        data: amIFollowing,
        message: "Yes user is following, found 😎",
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
  removeFollow: async (req: Request, res: Response) => {
    try {
      const { followId } = req.query;
      console.log("req.query", req.query);
      console.log({
        followId: followId,
      });
      if (!followId) {
        return res.status(400).send("followId is required to remove follow");
      }
      if (typeof followId !== "string") {
        return res.status(400).send("followId must be a string.");
      }
      const removedFollow = await Follow.findByIdAndDelete(followId)
      console.log("removedFollow", removedFollow);
      if (!removedFollow) {
        return res
          .status(400)
          .send({
            error: "Unable to remove follow, please REVIEW THE FOLLOW ID",
            message: removedFollow,
            ok: false
          });
      }
      return res.status(201).send({
        data: removedFollow,
        message: "Follow removed 😎",
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

export default followsCtrl;
