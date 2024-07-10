import mongoose, { Schema, Document } from 'mongoose';

export interface ICommentDream extends Document {
    user: mongoose.Types.ObjectId;
    dream: mongoose.Types.ObjectId;
    visibility: {
        isPublic: boolean;
        isVisibleForFriends: boolean;
        visibleFor: [mongoose.Types.ObjectId];
    }
    image: string;
    replayTo: mongoose.Types.ObjectId;
    isSubComment: boolean;
    comment: string;
}

const commentDreamSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    dream: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Dream",
        required: true,
    },
    visibility: {
        isPublic: {type: Boolean},
        isVisibleForFriends: {type: Boolean},
        visibleFor: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    },
    image: {type: String},
    replayTo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    },
    isSubComment: {type: Boolean},
    comment: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Creamos el modelo a partir del esquema.
const CommentDream = mongoose.model<ICommentDream>('CommentDream', commentDreamSchema);

export default CommentDream;
