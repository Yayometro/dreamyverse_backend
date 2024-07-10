import mongoose, { Schema } from "mongoose";
const MessageSchema = new Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        message: { type: String },
        media: { type: String }
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    removed: {
        forMeOnly: { type: Boolean },
        forAll: { type: Boolean },
    }
}, { timestamps: true });
// Creamos el modelo a partir del esquema.
const Message = mongoose.model("Message", MessageSchema);
export default Message;
