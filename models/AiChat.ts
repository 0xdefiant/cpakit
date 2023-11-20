import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import User from "./User";

// Define the schema
const aiChatSchema = new mongoose.Schema({
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    completion: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  });
  // Create the model
  aiChatSchema.plugin(toJSON);
  
  export default mongoose.model("AiChat", aiChatSchema);