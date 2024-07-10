
import { Request, Response } from "express";
import Notification from "../models/Notification";

export interface searchCtrlType {
    createNotification: (req: Request, res: Response) => void;
    getAllUserNotifications: (req: Request, res: Response) => void;
    removeNotification: (req: Request, res: Response) => void;
    removeAllNotifications: (req: Request, res: Response) => void;
}

const notifyCtrl: searchCtrlType = {
    createNotification: async (req: Request, res: Response) => {
        try {
            const  notification = req.body;
            if (typeof notification !== "object") {
                return res.status(400).send({
                    message: "notification must be a object.",
                    ok: false
                });
            }
            const newNotification = new Notification(notification)
            if (!newNotification) {
                return res.status(401).send({
                  message:
                    "Something went wrong while trying create your notification, pelase reload the app or try again later",
                    error: newNotification,
                    ok: false
                });
              }
            const savedNotification = await newNotification.save()
            if (!savedNotification) {
                return res.status(401).send({
                  message:
                    "Something went wrong while trying save your notification, pelase reload the app or try again later",
                    error: newNotification,
                    ok: false
                });
              }
            return res.status(200).send({
                data: savedNotification,
                message: "User notification was created correctly...",
                ok: true
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
    getAllUserNotifications: async (req: Request, res: Response) => {
        try {
            const { userId } = req.query;
            if (typeof userId !== 'string') {
                return res.status(400).send({
                    message: "UserID must be a string.",
                    ok: false
                });
            }
            const allUsersNotifications = await Notification.find({user: userId})
            if (!allUsersNotifications) {
                return res.status(401).send({
                  message:
                    "Something went wrong while trying to get all your notifications, pelase reload the app or try again later",
                    error: allUsersNotifications,
                    ok: false
                });
              }

            return res.status(200).send({
                data: allUsersNotifications,
                message: "User notifications get correctly...",
                ok: true
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
    removeNotification: async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            if (typeof id !== 'string') {
                return res.status(400).send({
                    message: "Id must be a string.",
                    ok: false
                });
            }
            const allUsersNotifications = await Notification.findByIdAndDelete(id)
            if (!allUsersNotifications) {
                return res.status(401).send({
                  message:
                    "Something went wrong while trying delete notifications, pelase reload the app or try again later. Not ID",
                    error: allUsersNotifications,
                    ok: false
                });
              }

            return res.status(200).send({
                data: allUsersNotifications,
                message: "Notification was removed correctly 😎",
                ok: true
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
    removeAllNotifications: async (req: Request, res: Response) => {
        try {
            const { userId } = req.query;
            if (typeof userId !== 'string') {
                return res.status(400).send({
                    message: "UserID must be a string.",
                    ok: false
                });
            }
            const allUsersNotifications = await Notification.deleteMany({user: userId})
            if (!allUsersNotifications) {
                return res.status(401).send({
                  message: "Something went wrong while trying delete all yournotifications, pelase reload the app or try again later. Not UserId",
                    error: allUsersNotifications,
                    ok: false
                });
              }

            return res.status(200).send({
                data: allUsersNotifications,
                message: "All motification were clear 😎",
                ok: true
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

export default notifyCtrl;
