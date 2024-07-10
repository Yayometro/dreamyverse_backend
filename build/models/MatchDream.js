import mongoose, { Schema } from 'mongoose';
const matchDreamSchema = new Schema({
    user: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
    dreams: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dream",
        }],
    identifiers: {
        parts: [{ type: String }],
        unified: { type: String }
    }
}, { timestamps: true });
// Creamos el modelo a partir del esquema.
const MatchDream = mongoose.model('MatchDream', matchDreamSchema);
export default MatchDream;
