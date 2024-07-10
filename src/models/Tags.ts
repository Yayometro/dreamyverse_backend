import mongoose, { Schema, Document } from 'mongoose';

interface ITag extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    dreamsRef: [mongoose.Types.ObjectId]
}

const tagSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    },
    name: {type: String},
    dreamsRef: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Dream",
    }],
}, { timestamps: true });

// Creamos el modelo a partir del esquema.
const Tag = mongoose.model<ITag>('Tag', tagSchema);

export default Tag;
