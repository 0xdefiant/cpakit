import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const NFTSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    walletName: {
      type: String,
      trim: true,
      ref: 'Wallet',
      lowercase: true,
      required: true,
    },
    wallet: {
      type: String,
      trim: true,
      ref: 'Wallet',
      lowercase: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    address: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    floorPrice: {
      type: Number,
      required: true
    },
    tokenType: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    tokenId: {
      type: Number,
      lowercase: true,
      required: true
    },
    tokenUri: {
      type: String,
      trim: true,
      required: false
    },
    imageUrl: {
      type: String,
      trim: true,
      required: true
    },
    timeLastUpdated: {
      type: String,
      trim: true,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

NFTSchema.plugin(toJSON);

export default mongoose.models.NFT || mongoose.model("NFT", NFTSchema);
