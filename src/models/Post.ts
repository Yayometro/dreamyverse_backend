import mongoose, { Schema, Document } from 'mongoose';

interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    visibility: {
        isPublic: boolean;
        isVisibleForFriends: boolean;
        othersCanComment: boolean;
        othersCanShare: boolean;
        visibleFor: [mongoose.Types.ObjectId] | [] | null;
    }
    title: string;
    content: string;
    date: Date;
    media: {
        image: string,
        video: string
    } | null
    people:{
        fromApp: [{
            wantedToKnow: boolean,
            person: mongoose.Types.ObjectId
        }],
        fromNoApp: [string]
    } | null
}

const postSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    visibility: {
        isPublic: {type: Boolean},
        isVisibleForFriends: {type: Boolean},
        othersCanComment: {type: Boolean},
        othersCanShare: {type: Boolean},
        visibleFor: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    },
    title: { type: String},
    content: { type: String, required: true },
    date: {type: Date},
    media: {
        image: {type: String},
        video: {type: String}
    },
    people: {
        fromApp: [{
            wantedToKnow: {type: Boolean},
            person: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        }],
        fromNoApp: [{type: String}]
    },
}, { timestamps: true });

// Creamos el modelo a partir del esquema.
const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
