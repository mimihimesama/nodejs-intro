import express from "express";
import Item from "../schemas/items.schema.js";
import Joi from "joi";

const router = express.Router();

/* 아이템 생성 API */
const createItemSchema = Joi.object({
  item_code: Joi.number().required(),
  item_name: Joi.string().min(1).max(15).required(),
  item_stat: Joi.object().required(),
});

router.post("/items", async (req, res, next) => {
  try {
    const validation = await createItemSchema.validateAsync(req.body);
    const { item_code, item_name, item_stat } = validation;

    const item = new Item({ item_code, item_name, item_stat });
    await item.save();
    return res.status(201).json({ message: "아이템이 생성되었습니다." });
  } catch (err) {
    next(err);
  }
});

/* 아이템 목록 조회 API */
router.get("/items", async (req, res) => {
  const items = await Item.find({}, { item_code: 1, item_name: 1, _id: 0 }).sort({ item_code: 1 });
  return res.status(200).json(items);
});

/* 아이템 상세 조회 API */
router.get("/items/:itemId", async (req, res) => {
  const { itemId } = req.params;

  const item = await Item.findOne({
    item_code: itemId,
  }).exec();
  if (!item) {
    return res.status(404).json({ errorMessage: "아이템 조회에 실패하였습니다." });
  }

  return res.status(200).json({
    item_code: item.item_code,
    item_name: item.item_name,
    item_stat: item.item_stat,
  });
});

/* 아이템 수정 API */
const updateItemSchema = Joi.object({
  item_name: Joi.string().min(1).max(15).optional(),
  item_stat: Joi.object().optional(),
});

router.patch("/items/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const validation = await updateItemSchema.validateAsync(req.body);
    const { item_name, item_stat } = validation;

    const item = await Item.findOne({ item_code: itemId }).exec();

    if (!item) {
      return res.status(404).json({ errorMessage: "아이템을 찾을 수 없습니다." });
    }

    if (item_name) {
      item.item_name = item_name;
    }
    if (item_stat) {
      item.item_stat = item_stat;
    }

    await item.save();

    return res.status(200).json({ message: "아이템이 성공적으로 업데이트되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
