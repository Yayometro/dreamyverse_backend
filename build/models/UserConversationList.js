import mongoose, { Schema } from 'mongoose';
const userConversationListSchema = new Schema({
    conversationsList: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
        }],
}, { timestamps: true });
// Creamos el modelo a partir del esquema.
const UserConversationList = mongoose.model('UserConversation', userConversationListSchema);
export default UserConversationList;
