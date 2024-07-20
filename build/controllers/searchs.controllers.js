"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const Dream_1 = __importDefault(require("../models/Dream"));
const searchCtrl = {
    generalSearch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { q } = req.query;
            if (typeof q !== 'string') {
                return res.status(400).send({
                    message: "Query must be a string.",
                    ok: false
                });
            }
            const users = yield User_1.default.find({ $text: { $search: q } }).select('-password').limit(10);
            const dreamsByText = yield Dream_1.default.find({ $text: { $search: q } }).populate("user").limit(10);
            const dreamsByUser = yield Dream_1.default.find({ user: { $in: users.map(user => user._id) } }).populate("user").limit(10);
            const dreams = [...dreamsByText, ...dreamsByUser];
            return res.status(200).send({
                data: {
                    users,
                    dreams
                },
                message: "Search results",
                ok: true
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(500).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
            }
            else {
                console.error(e);
                return res.status(500).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
            }
        }
    }),
};
exports.default = searchCtrl;
