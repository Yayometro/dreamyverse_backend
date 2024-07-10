import mongoose, { Schema, Document } from 'mongoose';

interface IUserConversationList extends Document {
    user: mongoose.Types.ObjectId;
    conversationsList: [mongoose.Types.ObjectId]
}

const userConversationListSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    conversationsList: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Conversation",
    }],
}, { timestamps: true });

// Creamos el modelo a partir del esquema.
const UserConversationList = mongoose.model<IUserConversationList>('UserConversation', userConversationListSchema);

export default UserConversationList;
