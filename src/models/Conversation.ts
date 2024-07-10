import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    isGroup: boolean;
    isBlocked?: boolean;
    isMuted?: boolean;
}

const conversationSchema: Schema = new Schema({
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    }],
    isGroup: { type: Boolean },
    isBlocked: { type: Boolean },
    isMuted: { type: Boolean },
}, { timestamps: true });

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
