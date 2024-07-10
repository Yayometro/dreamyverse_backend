import mongoose, { Schema, Document } from 'mongoose';

interface IUserFriendList extends Document {
    user: mongoose.Types.ObjectId;
    friends: [mongoose.Types.ObjectId]
}

const userFriendListSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    friends: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    }]
}, { timestamps: true });

// Creamos el modelo a partir del esquema.
const UserFriendList = mongoose.model<IUserFriendList>('UserFriendList', userFriendListSchema);

export default UserFriendList;
