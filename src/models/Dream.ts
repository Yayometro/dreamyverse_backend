import mongoose, { Schema, Document } from 'mongoose';

export interface IDream extends Document {
    user: mongoose.Types.ObjectId;
    visibility: {
        isPublic: boolean;
        isVisibleForFriends: boolean;
        othersCanComment: boolean;
        othersCanShare: boolean;
        visibleFor: [mongoose.Types.ObjectId] | [] | null;
    }
    dream: string;
    title: string;
    date: Date;
    category: string;
    image: string;
    people: {
        fromApp: [{
            wantedToKnow: boolean,
            person: mongoose.Types.ObjectId
        }] | [],
        fromNoApp: [string]
        noNotified: [string]
    } | null
    recording: string;
    isLucid: boolean;
}

const dreamSchema: Schema = new Schema({
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
    title: { type: String },
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
        fromNoApp: [{ type: String }],
        noNotified: [{ type: String }]
    },
    recording: { type: String },
    isLucid: { type: Boolean },
}, { timestamps: true });

// Agregar índice de texto
dreamSchema.index({ 
    dream: 'text', 
    title: 'text' 
});

const Dream = mongoose.model<IDream>('Dream', dreamSchema);

export default Dream;
