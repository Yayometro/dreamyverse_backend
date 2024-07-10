import mongoose, { Schema } from 'mongoose';
const conversationSchema = new Schema({
    participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],
}, { timestamps: true });
// Creamos el modelo a partir del esquema.
const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
