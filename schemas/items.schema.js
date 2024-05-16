import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  item_code: Number,
  item_name: String,
  item_stat: {
    health: Number,
    power: Number,
  },
});

export default mongoose.model("Item", itemSchema);
