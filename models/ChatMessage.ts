import mongoose from 'mongoose';
import toJSON from './plugins/toJSON';

const chatMessageSchema = new mongoose.Schema(
    {
        prompt: {
            type: String,
            required: true,
        },
        response: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// add plugin that converts mongoose to json
chatMessageSchema.plugin(toJSON);

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
