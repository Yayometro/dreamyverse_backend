import mongoose, { Schema, Document } from 'mongoose';

interface IMAtchDream extends Document {
    users: [mongoose.Types.ObjectId];
    dreams: [mongoose.Types.ObjectId];
    identifiers: {
        parts: [string],
        unified: string
    }
}

const matchDreamSchema: Schema = new Schema({
    user: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    }],
    dreams: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Dream",
    }],
    identifiers: {
        parts: [{type: String}],
        unified: {type: String}
    }
}, { timestamps: true });

// Creamos el modelo a partir del esquema.
const MatchDream = mongoose.model<IMAtchDream>('MatchDream', matchDreamSchema);

export default MatchDream;
