import mongoose, { Schema } from 'mongoose';
const tagSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: { type: String },
    dreamsRef: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dream",
        }],
}, { timestamps: true });
// Creamos el modelo a partir del esquema.
const Tag = mongoose.model('Tag', tagSchema);
export default Tag;
