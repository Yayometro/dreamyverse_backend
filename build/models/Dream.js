"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const dreamSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    visibility: {
        isPublic: { type: Boolean },
        isVisibleForFriends: { type: Boolean },
        othersCanComment: { type: Boolean },
        othersCanShare: { type: Boolean },
        visibleFor: [{
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            }]
    },
    dream: { type: String, required: true },
    title: { type: String },
    date: { type: Date },
    category: { type: String },
    image: { type: String },
    people: {
        fromApp: [{
                wantedToKnow: { type: Boolean },
                person: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "User",
                }
            }],
        fromNoApp: [{ type: String }],
        noNotified: [{ type: String }]
    },
    recording: { type: String },
    isLucid: { type: Boolean },
}, { timestamps: true });
// Agregar índice de texto
dreamSchema.index({
    dream: 'text',
    title: 'text'
});
const Dream = mongoose_1.default.model('Dream', dreamSchema);
exports.default = Dream;
