import mongoose, { Schema, Document } from 'mongoose';

interface IReaction extends Document {
    user: mongoose.Types.ObjectId;
    dream?: mongoose.Types.ObjectId | null;
    comment?: mongoose.Types.ObjectId | null;
    post?: mongoose.Types.ObjectId | null;
    message?: mongoose.Types.ObjectId | null;
    visibility?: {
        isPublic: boolean;
        isVisibleForFriends: boolean;
        visibleFor: [mongoose.Types.ObjectId];
    }
    icon?: string;
}

const reactionSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    dream: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Dream",
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "CommentDream",
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post",
    },
    message: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Message",
    },
    visibility: {
        isPublic: {type: Boolean},
        isVisibleForFriends: {type: Boolean},
        visibleFor: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    },
    icon: {type: String}
}, { timestamps: true });

// Creamos el modelo a partir del esquema.
const Reaction = mongoose.model<IReaction>('Reaction', reactionSchema);

export default Reaction;
