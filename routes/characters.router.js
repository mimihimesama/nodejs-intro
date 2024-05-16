import express from "express";
import { Character, Item } from "../schemas/characters.schema.js";
import Joi from "joi";

const router = express.Router();

/* 캐릭터 생성 API */
const createCharacterSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
});

router.post("/characters", async (req, res, next) => {
  try {
    const validation = await createCharacterSchema.validateAsync(req.body);
    const { name } = validation;

    if (await Character.findOne({ name })) {
      return res
        .status(400)
        .json({ errorMessage: "이미 존재하는 이름입니다." });
    }

    const lastCharacter = await Character.findOne()
      .sort("-character_id")
      .exec();
    const newCharacterId = lastCharacter ? lastCharacter.character_id + 1 : 1;

    const character = new Character({ name, character_id: newCharacterId });

    await character.save();

    return res.status(201).json({
      message: `새로운 캐릭터 ‘${name}’를 생성하셨습니다!`,
      data: {
        character_id: newCharacterId,
      },
    });
  } catch (error) {
    next(error);
  }
});

/* 캐릭터 상세 조회 API */
router.get("/characters/:characterId", async (req, res) => {
  const { characterId } = req.params;

  const character = await Character.findOne({
    character_id: characterId,
  }).exec();
  if (!character) {
    return res
      .status(404)
      .json({ errorMessage: "캐릭터 조회에 실패하였습니다." });
  }

  return res.status(200).json({
    data: {
      name: character.name,
      health: character.health,
      power: character.power,
    },
  });
});

/* 캐릭터 삭제 API */
router.delete("/characters/:characterId", async (req, res) => {
  const { characterId } = req.params;

  const character = await Character.findOne({
    character_id: characterId,
  }).exec();
  if (!character) {
    return res
      .status(404)
      .json({ errorMessage: "캐릭터 조회에 실패하였습니다." });
  }

  await Character.deleteOne({ character_id: characterId }).exec();

  return res.status(200).json({
    message: `캐릭터 ‘${character.name}’를 삭제하였습니다.`,
  });
});

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
  const items = await Item.find(
    {},
    { item_code: 1, item_name: 1, _id: 0 },
  ).sort({ item_code: 1 });
  return res.status(200).json(items);
});

/* 아이템 상세 조회 API */
router.get("/items/:itemId", async (req, res) => {
  const { itemId } = req.params;

  const item = await Item.findOne({
    item_code: itemId,
  }).exec();
  if (!item) {
    return res
      .status(404)
      .json({ errorMessage: "아이템 조회에 실패하였습니다." });
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
      return res
        .status(404)
        .json({ errorMessage: "아이템을 찾을 수 없습니다." });
    }

    if (item_name) {
      item.item_name = item_name;
    }
    if (item_stat) {
      item.item_stat = item_stat;
    }

    await item.save();

    return res
      .status(200)
      .json({ message: "아이템이 성공적으로 업데이트되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;


