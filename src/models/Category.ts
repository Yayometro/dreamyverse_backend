import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    color: string;
    icon: string;
    isDefault: boolean;
}

const categorySchema: Schema = new Schema({
    name: {type: String},
    color: {type: String},
    icon: {type: String},
    isDefault: {type: Boolean, required: true},
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    },
}, { timestamps: true });

// Creamos el modelo a partir del esquema.
const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
