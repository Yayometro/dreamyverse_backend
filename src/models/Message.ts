import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  fromUser: mongoose.Types.ObjectId;
  receiverUser: mongoose.Types.ObjectId;
  conversation: mongoose.Types.ObjectId;
  content: {
    message: string;
    media: string;
  };
  read: boolean,
  removed: {
    for: mongoose.Types.ObjectId[];
    forAll: boolean;
  };
}

const MessageSchema: Schema = new Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    read: {type : Boolean},
    content: {
      message: { type: String },
      media: { type: String },
    },
    removed: {
      for: [{ type: Schema.Types.ObjectId, ref: "User" }],
      forAll: { type: Boolean },
    },
  },
  { timestamps: true }
);

// Creamos el modelo a partir del esquema.
const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
