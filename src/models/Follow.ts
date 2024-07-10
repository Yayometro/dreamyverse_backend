import mongoose, { Schema, Document } from 'mongoose';

interface IFollow extends Document {
    follower: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    dream: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
}

const followSchema: Schema = new Schema({
    follower: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    },
    dream: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Dream",
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post",
    },
}, { timestamps: true });

// Creamos el modelo a partir del esquema.
const Follow = mongoose.model<IFollow>('Follow', followSchema);

export default Follow;
