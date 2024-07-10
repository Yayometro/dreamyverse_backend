import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    mail: string;
    password: string;
    name: string;
    lastName: string;
    phone: number;
    date: Date;
    avatar: string;
    zodiac: string;
    _id?: string | mongoose.Types.ObjectId
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    mail: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    name: { type: String },
    lastName: { type: String },
    phone: { type: Number },
    birthDate: { type: Date },
    avatar: { type: String },
    zodiac: { type: String }
}, { timestamps: true });

// Agregar índice de texto
userSchema.index({ 
    username: 'text', 
    mail: 'text', 
    name: 'text', 
    lastName: 'text', 
    phone: 'text' 
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
