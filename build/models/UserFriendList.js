import mongoose, { Schema } from 'mongoose';
const userFriendListSchema = new Schema({
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
const UserFriendList = mongoose.model('UserFriendList', userFriendListSchema);
export default UserFriendList;
