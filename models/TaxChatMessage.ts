import mongoose from 'mongoose';
import toJSON from './plugins/toJSON';

const taxChatMessageSchema = new mongoose.Schema(
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
taxChatMessageSchema.plugin(toJSON);

export default mongoose.models.TaxChatMessage || mongoose.model('TaxChatMessage', taxChatMessageSchema);
