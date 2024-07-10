import mongoose, { Schema } from 'mongoose';
const categorySchema = new Schema({
    name: { type: String },
    color: { type: String },
    icon: { type: String },
    isDefault: { type: Boolean, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
// Creamos el modelo a partir del esquema.
const Category = mongoose.model('Category', categorySchema);
export default Category;
