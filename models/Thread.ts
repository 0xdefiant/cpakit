import mongoose from 'mongoose';
import toJSON from './plugins/toJSON';

const storeThread = new mongoose.Schema(
    {
        thread_id: {
            type: String,
            required: true,
        },
        assistantId: {
            type: String,
            required: true,
        },
        runId: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        allMessageContents: {
            type: Array,
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// add plugin that converts mongoose to json
storeThread.plugin(toJSON);

export default mongoose.models.storeThread || mongoose.model('storeThread', storeThread);
