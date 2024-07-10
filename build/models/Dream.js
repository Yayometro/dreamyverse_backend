import mongoose, { Schema } from 'mongoose';
const dreamSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    visibility: {
        isPublic: { type: Boolean },
        isVisibleForFriends: { type: Boolean },
        othersCanComment: { type: Boolean },
        othersCanShare: { type: Boolean },
        visibleFor: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }]
    },
    dream: { type: String, required: true },
    date: { type: Date },
    category: { type: String },
    image: { type: String },
    people: {
        fromApp: [{
                wantedToKnow: { type: Boolean },
                person: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                }
            }],
        fromNoApp: [{ type: String }]
    },
    recording: { type: String },
    isLucid: { type: Boolean },
}, { timestamps: true });
// Creamos el modelo a partir del esquema.
const Dream = mongoose.model('Dream', dreamSchema);
export default Dream;
