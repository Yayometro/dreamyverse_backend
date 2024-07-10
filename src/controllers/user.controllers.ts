import mongoose, { Types } from "mongoose";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import User, { IUser } from "../models/User";
import Message from "../models/Message";
import Conversation from "../models/Conversation";
import UserFriendList from "../models/UserFriendList";


export interface userCtrlType {
  login: (req: Request, res: Response) => void;
  register: (req: Request, res: Response) => void;
  update: (req: Request, res: Response) => void;
  getUserPost: (req: Request, res: Response) => void;
  getUser: (req: Request, res: Response) => void;
  getUserByUsername: (req: Request, res: Response) => void;
  getUsersById: (req: Request, res: Response) => void;
}

//Const
const userCtrl: userCtrlType = {
  login: async (req: Request, res: Response) => {
    //
    try {
      const { mail, password } : { mail:string, password: string} = req.body;
      console.log(req.body);
      const findUser = await User.findOne({ mail });
      console.log(findUser);
      if (!findUser) {
        return res.status(401).send({
          ok: false,
          message:
            "Unidentified user. Check the email entered and try again ❌",
        });
      }
      //Password match
      let passwordMatch: unknown 
      if(findUser){
        passwordMatch = await bcryptjs.compare(password, findUser.password);
        console.log('passwordMatch:', passwordMatch)
        if(!passwordMatch){
          return res.status(401).send({
            ok: false,
            message:
              "Password don't match, please review it and try again ❌",
          });
          // throw new Error("Password don't match, please review it and try again ❌")
        }
        findUser.password = "";
      }
      //Password error
      //Send to FRONT
      return res.status(201).send({
        data: findUser,
        message: "User found correctly 😎",
        ok: true,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message: "An unexpected error has occurred, please try again later.",
      });
    }
  },
  register: async (req: Request, res: Response) => {
    try {
      console.log("first");
      const {
        username,
        mail,
        password,
        name,
        lastName,
        phone,
        avatar,
        zodiac,
      } = req.body;
      console.log(req.body);
      //User or mail copy check
      const mailInUse = await User.findOne({ mail });
      if (mailInUse) {
        console.log('Correo en uso')
        return res.status(401).send({
          message:
            "This user's email is already in use. Check the email entered and try a new one 🚨",
        });
      }
      const usernameInUse = await User.findOne({ username });
      if (usernameInUse) {
        console.log('usernameInUse: ', usernameInUse)
        return res.status(401).send({
          message:
            "The username is already in use. Check the username entered and try again 🚨",
        });
      }
      // Encrypt
      const salt = await bcryptjs.genSalt(10);
      const encryptPassword = await bcryptjs.hash(password, salt);
      // CREATION
      const phoneParsed = Number(phone)
      const newUser = new User({
        username,
        mail,
        name: name || null,
        lastName: lastName || null,
        phone: phoneParsed || null,
        avatar: avatar || null,
        zodiac: zodiac || null,
      });
      newUser.password = encryptPassword;

      //Find Feedback user
      const findFeedbackTeam = await User.findById("663050351d4cd21299492e1d");
      if (!findFeedbackTeam) throw new Error("No Feedback user team founded");
      console.log(findFeedbackTeam);

      // Creation of other instances
      const newConversation = new Conversation({
        participants: [newUser._id, findFeedbackTeam._id],
      });
      const messageWelcome = new Message({
        fromUser: findFeedbackTeam._id,
        content: {
          message:
            "Welcome to DreamyVerse from the Team. We hope you enjoy your experience here and any feedback you want to add, please let us here ☺️",
        },
      });
      // new UserFriendList
      const newUserFriendList = new UserFriendList({
        user: newUser._id,
      });
      // Associations:
      messageWelcome.conversation = newConversation._id as Types.ObjectId;

      //Savings:
      const savedUser = await newUser.save();
      if (!savedUser) {
        throw new Error("No user was saved creating a NEW USER ❌");
      }
      const savedConversation = await newConversation.save();
      if (!savedConversation) {
        throw new Error(
          "No savedConversation was saved creating a NEW USER ❌"
        );
      }
      const savedMessageWelcome = await messageWelcome.save();
      if (!savedMessageWelcome) {
        throw new Error(
          "No savedMessageWelcome was saved creating a NEW USER ❌"
        );
      }
      const savedUserFriendList = await newUserFriendList.save();
      if (!savedUserFriendList)
        throw new Error("No user friend list was saved creating a NEW USER ❌");

      //Send to FRONT
      return res.status(201).send({
        data: {
          user: savedUser,
          frindList: savedUserFriendList,
        },
        message: "User created correctly 👌",
        ok: true,
      });
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        throw new Error(e.message);
      } else {
        console.error(e);
        return res.status(500).send({
          message: "An unexpected error has occurred trying to access database, please try again later.",
        });
        // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
      }
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const userEdited : IUser = req.body;
      console.log(req.body);
      console.log({userEdited: userEdited});

      if(!userEdited){
        return res.status(401).send("User obj must be introduced, please review the body of your request")
      }
      if(!userEdited._id){
        return res.status(401).send("User ID must be introduced, please review and try again")
      }
      if(!userEdited.username){
        return res.status(401).send("User username be introduced, please review and try again")
      }
      if(!userEdited.mail){
        return res.status(401).send("User mail be introduced, please review and try again")
      }
      if(typeof userEdited !== "object"){
        return res.status(401).send("Revisa que el tipo de datos introducidos en 'phone' sean numerico.")
      }
      //User or mail copy check
      const userUpdated = await User.findByIdAndUpdate(
        userEdited._id,
        { $set: userEdited },
        { new: true }
      )
      if (!userUpdated) {
        return res.status(401).send({
          message:
            "The user could not be found. Check the email entered and try a new one 🚨",
            error: userUpdated,
            ok: false
        });
      }
      return res.status(201).send({
        data: userUpdated,
        message: "User updated correctly 👌",
        ok: true,
      });
    
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        throw new Error(e.message);
      } else {
        console.error(e);
        return res.status(500).send({
          message: "An unexpected error has occurred, please try again later.",
        });
    
        // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
      }
    }
  },
  getUserPost: async (req: Request, res: Response) => {
    //
    try {
      const { mail } = req.body;
      console.log(req.body);
      console.log(mail);
      if (!mail) {
        return res.status(401).send({
          status: 401,
          ok: false,
          message:
            "mail as req.body is null or undefined, please review the data and try again ❌",
        });
      }
      const findUser = await User.findOne({ mail });
      console.log(findUser);
      if (!findUser) {
        return res.status(401).send({
          status: 401,
          ok: false,
          message:
            "Unidentified user. Check the email entered and try again ❌",
        });
      }
      //Send to FRONT
      return res.status(201).send({
        data: findUser,
        message: "User found correctly 🤓",
        ok: true,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        throw new Error(e.message);
      } else {
        console.error(e);
        throw new Error(
          "An unexpected error has occurred, please try again later."
        );
        // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
      }
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
        const {id} = req.query
        console.log("id:", id)
        if (typeof id !== 'string') {
            return res.status(400).send({
                message: "ID must be a string.",
                ok: false
            });
        }

        const userFound = await User.findById(id)
        if(!userFound) return res.status(401).send({
            message: "No user found on 'getUser', review the ID or try again later",
            ok: false
           })
           userFound.password = ""
        console.log(userFound)
        return res.status(201).send({
            data: userFound,
            message: "User found 😎",
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
  getUserByUsername: async (req: Request, res: Response) => {
    try {
        const {username} = req.query
        console.log("username:", username)
        if (typeof username !== 'string') {
            return res.status(400).send({
                message: "username must be a string.",
                ok: false
            });
        }

        const userFound = await User.findOne({username: username})
        if(!userFound) return res.status(401).send({
            message: "No user found on 'getUser', review the username or try again later",
            ok: false
           })
           userFound.password = ""
        console.log(userFound)
        return res.status(201).send({
            data: userFound,
            message: "User found 😎",
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
  getUsersById: async (req: Request, res: Response) => {
    try {
      const { idsArray } = req.body;
      console.log("getUsersById:", idsArray);
  
      if (!Array.isArray(idsArray)) {
        return res.status(400).send({
          message: "idsArray must be an array of ObjectId.",
          ok: false
        });
      }
  
      const objectIdArray = idsArray.map(id => new mongoose.Types.ObjectId(id));
      
      const usersFound = await User.find({ _id: { $in: objectIdArray } });
      
      // if (usersFound.length === 0) {
      //   return res.status(401).send({
      //     message: "No users found for the provided IDs.",
      //     ok: false
      //   });
      // }
      
      usersFound.forEach(user => user.password = "");
  
      return res.status(201).send({
        data: usersFound,
        message: "Users found 😎",
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
};

export default userCtrl;
