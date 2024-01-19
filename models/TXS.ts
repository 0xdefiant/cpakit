import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// Define the schema for TxMetadata
const TxMetadataSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    wallet: {
      type: String,
      trim: true,
      ref: 'Wallet',
      lowercase: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    tokenName: {
      type: String,
      trim: true,
      required: true
    },
    tokenSymbol: {
      type: String,
      trim: true,
      uppercase: true,
      required: true
    },
    fromAddress: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    toAddress: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    tx_hash: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    log_index: {
      type: Number,
      required: true,
      unique: true
    },
    block_timestamp: {
      type: String,
      trim: true,
      required: true
    },
    value_decimal: {
      type: Number,
      required: true
    },
    usdPrice: {
      type: Number,
      required: false,
      default: null
    },
    historicalTokenPrice: {
      type: Number,
      required: false,
      default: null
    },
    grossProfit: {
      type: Number,
      required: false,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

// Apply the toJSON plugin to convert MongoDB _id to id and remove __v
TxMetadataSchema.plugin(toJSON);

// Export the model
export default mongoose.models.TX || mongoose.model("TX", TxMetadataSchema);
