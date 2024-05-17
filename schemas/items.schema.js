import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  item_code: { type: Number, unique: true },
  item_name: String,
  item_stat: {
    health: Number,
    power: Number,
  },
});

export default mongoose.model("Item", itemSchema);
