import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  character_id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  health: {
    type: Number,
    default: 500,
  },
  power: {
    type: Number,
    default: 100,
  },
});

export default mongoose.model("Character", characterSchema);
