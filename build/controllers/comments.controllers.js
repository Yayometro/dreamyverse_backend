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
const CommentDream_1 = __importDefault(require("../models/CommentDream"));
const Dream_1 = __importDefault(require("../models/Dream"));
//Const
const commentCtrl = {
    createComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { father, type, userMail, comment } = req.body;
            console.log("req.query", req.body);
            console.log({
                father: father,
                type: type,
                comment: comment,
                userMail: userMail,
            });
            if (typeof father !== "string" ||
                typeof type !== "string" ||
                typeof userMail !== "string") {
                console.log({
                    father: father,
                    type: type,
                    comment: comment,
                    userMail: userMail,
                });
                return res.status(400).send("argument must be a string.");
            }
            const userFound = yield User_1.default.findOne({ mail: userMail });
            if (!userFound)
                return res
                    .status(401)
                    .send("No user found on 'createComment', review the mail or try again later");
            //
            let fatherFound;
            let newComment;
            if (type === "dream") {
                fatherFound = yield Dream_1.default.findById(father);
                if (!fatherFound)
                    return res
                        .status(401)
                        .send("No dream found on 'createComment', review the dream_id or try again later");
                newComment = new CommentDream_1.default(comment);
                newComment.user = userFound._id;
                newComment.dream = fatherFound._id;
                console.log("newComment: ", newComment);
            }
            if (!newComment)
                return res.status(401).send({
                    message: "NewComment was not created, review the info provided or try again later",
                    ok: false,
                });
            const commentSaved = yield newComment.save();
            if (!commentSaved)
                return res.status(401).send({
                    message: "No comment saved on 'createComment', review the info provided or try again later",
                    ok: false,
                });
            console.log(commentSaved);
            return res.status(201).send({
                data: commentSaved,
                message: "New comment created 😎",
                ok: true,
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(401).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
                // throw new Error(e.message);
            }
            else {
                console.error(e);
                return res.status(401).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
                throw new Error("An unexpected error has occurred, please try again later.");
                // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
            }
        }
    }),
    getAllCommentsFromDreamCard: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const foundAllComments = yield CommentDream_1.default.find({
                dream: dreamId,
            }).populate("user");
            console.log("foundAllComments", foundAllComments);
            if (!foundAllComments)
                return res.status(401).send({
                    message: "No dreams found to send, please review the dreamId and try again",
                    ok: false,
                });
            return res.status(201).send({
                data: foundAllComments,
                message: "New comment created 😎",
                ok: true,
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(401).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
                // throw new Error(e.message);
            }
            else {
                console.error(e);
                return res.status(401).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
            }
        }
    }),
    removeCommentDream: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { commentId } = req.body; // Desestructurar correctamente el cuerpo de la solicitud
            console.log("commentId", commentId);
            if (!commentId) {
                return res.status(401).send({
                    error: "No commentId in req.body", // Corregir mensaje de error
                });
            }
            const commentRemoved = yield CommentDream_1.default.findByIdAndDelete(commentId);
            if (!commentRemoved) {
                return res.status(401).send({
                    error: "comment not removed, please review Id and try again",
                });
            }
            return res.status(201).send({
                message: "Comment was removed",
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(401).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
                // throw new Error(e.message);
            }
            else {
                console.error(e);
                return res.status(401).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
            }
        }
    }),
    editCommentDream: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { comment } = req.body;
        console.log("editCommentDream is running");
        console.log("comment", comment);
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
            const updateFields = {};
            if (comment.visibility !== undefined)
                updateFields.visibility = comment.visibility;
            if (comment.image !== undefined)
                updateFields.image = comment.image;
            if (comment.replayTo !== undefined)
                updateFields.replayTo = comment.replayTo;
            if (comment.isSubComment !== undefined)
                updateFields.isSubComment = comment.isSubComment;
            if (comment.comment !== undefined)
                updateFields.comment = comment.comment;
            const commentUpdated = yield CommentDream_1.default.findByIdAndUpdate(comment._id, { $set: updateFields }, { new: true }).populate("user");
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
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(500).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
                // throw new Error(e.message);
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
exports.default = commentCtrl;
