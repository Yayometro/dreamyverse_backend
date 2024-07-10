import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    username: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    lastName: { type: String },
    phone: { type: Number },
    avatar: { type: String },
    zodiac: { type: String }
}, { timestamps: true });
// Creamos el modelo a partir del esquema.
const User = mongoose.model('User', userSchema);
export default User;
