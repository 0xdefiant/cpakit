import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const walletSchema = new mongoose.Schema(
    {
    wallet: {
      type: String,
      trim: true,
      lowercase: true,
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
walletSchema.plugin(toJSON);

export default mongoose.models.wallet || mongoose.model("wallet", walletSchema);
