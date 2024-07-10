
import { Request, Response } from "express";
import Dream, { IDream } from "../models/Dream";
import User, { IUser } from "../models/User";
import Follow from "../models/Follow";
import { io } from "..";
import Notification from "../models/Notification";
import mapUsersSocket from "../helpers/mapUsersIdSocket";

export interface userCtrlType {
  getUserDreams: (req: Request, res: Response) => void;
  getDream: (req: Request, res: Response) => void;
  createDream: (req: Request, res: Response) => void;
  editDream: (req: Request, res: Response) => void;
  removeDream: (req: Request, res: Response) => void;
  getUserDreamsLenght: (req: Request, res: Response) => void;
  getAllPublicDreams: (req: Request, res: Response) => void;
  getHomeDreamsFeed: (req: Request, res: Response) => void;
}

interface IPeople {
  fromApp: {
    wantedToKnow: boolean;
    person: string | IUser;
  }[];
  fromNoApp: string[];
  noNotified: [string]
}

interface IVisibility {
  isPublic: boolean;
  isVisibleForFriends: boolean;
  othersCanComment: boolean;
  othersCanShare: boolean;
  visibleFor: [IUser | string] | [] | null;
}

//Const
const dreamCtrl: userCtrlType = {
  getUserDreams: async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      console.log("mail:", id);
      if (typeof id !== "string") {
        return res.status(400).send({
          message: "ID must be a string.",
          ok: false,
        });
      }
      const userFound = await User.findOne({ _id: id });
      if (!userFound)
        return res.status(401).send({
          message:
            "No user found on 'getUserDreams', review the _Id or try again later",
          ok: false,
        });

      const userDreams = await Dream.find({ user: userFound._id })
        .populate("user")
        .sort({ date: -1 });
      if (!userDreams)
        return res.status(401).send({
          message:
            "No dreams found on 'getUserDreams', review the ID or try again later",
          ok: false,
        });
      console.log(userDreams);
      return res.status(201).send({
        data: userDreams,
        message: "Dreams found 😎",
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
  getDream: async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      console.log("id:", id);
      if (typeof id !== "string") {
        return res.status(400).send({
          message: "ID must be a string.",
          ok: false,
        });
      }
      const dreamFound = await Dream.findById(id).populate("user")
      if (!dreamFound)
        return res.status(401).send({
          message:
            "No dream found on 'getDream', review the _Id or try again later",
          ok: false,
        });
      return res.status(201).send({
        data: dreamFound,
        message: "Dream found 😎",
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
  getHomeDreamsFeed: async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      console.log("userId:", userId);
      if (typeof userId !== "string") {
        return res.status(400).send({
          message: "userId must be a string.",
          ok: false,
        });
      }
      const userObjectId = userId
      // Encuentra los usuarios que el usuario sigue
      // const findFollowsFromUser = await Follow.find({ follower: userId }).populate("user").select("user -_id");
      // const findFollowsFromUser = await Follow.find({ 
      //   follower: userId, 
      //   // $or: [
      //   //   { dream: { $exists: false } },
      //   //   { post: { $exists: false } }
      //   // ]
      // }).populate("user").select("user -_id");
      // Encuentra los usuarios, sueños y posts que el usuario sigue
        const findFollowsFromUser = await Follow.find({
            follower: userId
        });
      // const findFollowsFromUser = await Follow.find({ user: userId }).populate("user").select("user -_id");
      if (!findFollowsFromUser) {
        return res.status(401).send({
          message: "No follows found for the user, review the userId or try again later",
          ok: false,
        });
      }
      // console.log("Aqui llego")
      // console.log("findFollowsFromUser", findFollowsFromUser)
      // // Extrae los IDs de los usuarios seguidos
      // const followedUserIds = findFollowsFromUser.map((follow) => follow.user._id);
      // console.log("Aqui llego X2")

       // Inicializa un conjunto para almacenar los IDs de usuarios, sueños y posts seguidos
       const followedIds = new Set();

       // Agrega los IDs de los usuarios seguidos
       findFollowsFromUser.forEach(follow => {
           followedIds.add(follow.user);
           if (follow.dream) followedIds.add(follow.dream);
           if (follow.post) followedIds.add(follow.post);
       });

       // Agrega el ID del usuario actual al conjunto
       followedIds.add(userObjectId);

       console.log("Aqui llego X2");

       // Busca los sueños (dreams) y los posts seguidos por el usuario
       const totalDreams = await Dream.find({
        $or: [
            { 
                $or: [
                    { user: { $in: Array.from(followedIds) } },
                    { _id: { $in: Array.from(followedIds) } }
                ]
            },
            { 
                $or: [
                    { "visibility.isPublic": true },
                    { "visibility.isVisibleForFriends": true }
                ]
            }
        ]
    })
        .populate("user")
        .sort({ date: -1 })
        .limit(400); // Limita los resultados a 400

      // // Agrega el ID del usuario actual a la lista
      // followedUserIds.push(userObjectId);
      // console.log("Aqui llego X3")
      //   const totalDreams = await Dream.find({
      //     user: { $in: followedUserIds }, //Search each index of the array
      //     $or: [
      //       { "visibility.isPublic": true },
      //       { "visibility.isVisibleForFriends": true }
      //     ] //The other criteria to select dreams
      //   })
      //     .populate("user")
      //     .sort({ date: -1 })
      //     .limit(400); // Limita los resultados a 400
  
      if (!totalDreams)
        return res.status(401).send({
          data: totalDreams,
          message:
            "No dreams found on 'getHomeDreamsFeed', review the ID or try again later",
          ok: false,
        });
        if (!totalDreams.length) {
          return res.status(401).send({
            message: "No dreams found, review the userId or try again later",
            ok: false,
          });
        }
  
      console.log(totalDreams);
      return res.status(201).send({
        data: totalDreams,
        message: "Dreams found 😎",
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
  getAllPublicDreams: async (_req: Request, res: Response) => {
    try {
      // const {id} = req.query
      // console.log("mail:", id)
      // if (typeof id !== 'string') {
      //     return res.status(400).send({
      //         message: "ID must be a string.",
      //         ok: false
      //     });
      // }
      const publicDreams = await Dream.find({ "visibility.isPublic": true })
        .populate("user")
        .sort({ date: -1 });
      if (!publicDreams)
        return res.status(401).send({
          message:
            "No dreams found on 'getpublicDreams', review the ID or try again later",
          ok: false,
        });
      // const publicDreamsOrdered
      if (publicDreams.length > 400) {
        return res.status(201).send({
          data: publicDreams.slice(0, 400),
          message: "Dream found limited to 400 😎",
          ok: true,
        });
      }
      return res.status(201).send({
        data: publicDreams,
        message: "Dream found 😎",
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
  createDream: async (req: Request, res: Response) => {
    try {
      const {
        user,
        visibility,
        dream,
        title,
        date,
        category,
        image,
        people,
        recording,
        isLucid,
      }: {
        user: string | IUser;
        visibility: IVisibility | null;
        dream: string | null;
        title: string | null;
        date: Date | null;
        category: string | null;
        image: string | null;
        people: IPeople | null;
        recording: string | null;
        isLucid: boolean | null;
      } = req.body;
  
      // Verifica si el usuario existe
      const userExists = await User.findById(user);
      if (!userExists) {
        return res.status(404).send({
          message: "User creator not found, review the userID",
          ok: false,
        });
      }
      
      const newDream = new Dream({
        user,
        visibility,
        dream,
        title,
        date,
        category,
        image,
        recording,
        isLucid,
      });
  
      const savedDream = await newDream.save();
      await savedDream.populate("user");
  
      if (!savedDream) {
        throw new Error("No dream was saved creating a NEW DREAM ❌");
      }
  
      // Notifications handling
      if (people && people.fromApp && people.fromApp.length > 0) {
        for (const taggedUser of people.fromApp) {
          const userFound = await User.findById(taggedUser.person);
          if (!userFound) {
            console.log("User not found", taggedUser.person);
            continue; // O puedes enviar un error si es crítico
          }
  
          const notification = new Notification({
            user: userFound._id,
            type: 'dream',
            redirectionalId: savedDream._id,
            message: `${userExists.username} has dreamed about you in a new dream 🌛`,
          });
  
          await notification.save();
          const socketId = mapUsersSocket[userFound._id as string]
          console.log("socketId", socketId)

          if (socketId) {
            console.log("Se identifico un socketId igual a ", socketId)
            io.to(socketId).emit("notification", notification);
            console.log("Se emitió una notificacion")
          }
        }
      }
  
      // Send to FRONT
      return res.status(201).send({
        data: savedDream,
        message: "Dream created correctly 😎",
        ok: true,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message: "An unexpected error has occurred, please try again later.",
        ok: false,
      });
    }
  },
  
  editDream: async (req: Request, res: Response) => {
    try {
      const editedDream: IDream = req.body;
      console.log({ editedDream: editedDream });
      // creating DREAM
      const editedDreamMongo = await Dream.findByIdAndUpdate(
        editedDream._id,
        { $set: editedDream },
        { new: true }
      ).populate("user");
      if (!editedDreamMongo) {
        res.status(401).send({
          error: editedDreamMongo,
          message: "No dream was edited while saving changes ❌",
        });
      }
      console.log("editedDreamMongo:", editedDreamMongo);
      //Notifications handdling
      if (editedDreamMongo?.people && editedDreamMongo.people.fromApp && editedDreamMongo.people.fromApp.length > 0) {
        for (const taggedUser of editedDreamMongo.people.fromApp) {
          const userFound = await User.findById(taggedUser.person)
          if(!userFound){
            console.log("User not found", userFound)
            res.status(401).send({
              error: userFound,
              message: "No user found while tagging users from app on the edition of your dream... 🚨",
              ok: false
            });
          }
          const notification = new Notification({
            user: userFound!._id,
            type: 'dream',
            redirectionalId: editedDreamMongo._id,
            message: `${(editedDreamMongo.user as unknown as IUser).username} has dreamed about you in a his dream 🌛`,
          });
          await notification.save();
          if(userFound){
            const socketId = mapUsersSocket[userFound._id as string]
            console.log(socketId)
              if (socketId) {
                io.to(socketId).emit("notification", notification);
              }
          }
        }
      }
      
      //Send to FRONT
      return res.status(201).send({
        data: editedDreamMongo,
        message: "Dream edited correctly 😎",
        ok: true,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message: "An unexpected error has occurred, please try again later.",
      });
    }
  },
  removeDream: async (req: Request, res: Response) => {
    try {
      const { dreamId } = req.query;
      console.log("req.query", req.query);
      console.log({
        dreamId: dreamId,
      });
      if (!dreamId) {
        return res.status(400).send("dreamId is required to remove Dream");
      }
      if (typeof dreamId !== "string") {
        return res.status(400).send("dreamId must be a string.");
      }
      const removedDream = await Dream.findByIdAndDelete(dreamId);
      console.log("removedDream", removedDream);
      if (!removedDream) {
        return res.status(400).send({
          error: "Unable to remove dream, please REVIEW THE Dream ID",
          message: removedDream,
          ok: false,
        });
      }
      return res.status(201).send({
        data: removedDream,
        message: "Dream removed 😎",
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
  getUserDreamsLenght: async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      console.log("req.query", req.query);
      console.log({
        userId: userId,
      });
      if (!userId) {
        return res
          .status(400)
          .send("userId is required to found dreams lenght");
      }
      if (typeof userId !== "string") {
        return res.status(400).send("userId must be a string.");
      }
      const getDreams = await Dream.find({ user: userId });
      console.log("getDreams", getDreams);
      if (!getDreams) {
        return res.status(400).send({
          error: "Unable to find dreams length",
          message: getDreams,
          ok: false,
        });
      }
      return res.status(201).send({
        data: getDreams.length,
        message: "Dream length found 😎",
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

export default dreamCtrl;
