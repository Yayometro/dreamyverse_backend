import mongoose, { Schema } from 'mongoose';
const commentSchema = new Schema({
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
        isPublic: { type: Boolean },
        isVisibleForFriends: { type: Boolean },
        visibleFor: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }]
    },
    image: { type: String },
    replayTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dream",
    },
    isSubComment: { type: Boolean },
    comment: {
        type: String,
        required: true,
    }
}, { timestamps: true });
// Creamos el modelo a partir del esquema.
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
