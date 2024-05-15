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

const itemSchema = new mongoose.Schema({
  item_code: Number,
  item_name: String,
  item_stat: {
    health: Number,
    power: Number,
  },
});

const Character = mongoose.model("Character", characterSchema);
const Item = mongoose.model("Item", itemSchema);

export { Character, Item };
