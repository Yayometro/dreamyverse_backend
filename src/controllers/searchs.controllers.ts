import { Request, Response } from "express";
import User from "../models/User";
import Dream from "../models/Dream";

export interface searchCtrlType {
    generalSearch: (req: Request, res: Response) => void;
}

const searchCtrl: searchCtrlType = {
    generalSearch: async (req: Request, res: Response) => {
        try {
            const { q } = req.query;
            if (typeof q !== 'string') {
                return res.status(400).send({
                    message: "Query must be a string.",
                    ok: false
                });
            }

            const users = await User.find({ $text: { $search: q } }).select('-password').limit(10);

            const dreamsByText = await Dream.find({ $text: { $search: q } }).populate("user").limit(10);

            const dreamsByUser = await Dream.find({ user: { $in: users.map(user => user._id) } }).populate("user").limit(10);

            const dreams = [...dreamsByText, ...dreamsByUser];

            return res.status(200).send({
                data: {
                    users,
                    dreams
                },
                message: "Search results",
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

export default searchCtrl;
