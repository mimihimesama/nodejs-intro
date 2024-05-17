import express from "express";
import Character from "../schemas/characters.schema.js";
import Item from "../schemas/items.schema.js";
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
      return res.status(400).json({ errorMessage: "이미 존재하는 이름입니다." });
    }

    const lastCharacter = await Character.findOne().sort("-character_id").exec();
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

/* 캐릭터 목록 조회 API */
router.get("/characters", async (req, res) => {
  const characters = await Character.find({}, { character_id: 1, name: 1, _id: 0 }).sort({ character_id: 1 });
  return res.status(200).json(characters);
});

/* 캐릭터 상세 조회 API */
router.get("/characters/:characterId", async (req, res) => {
  const { characterId } = req.params;

  const character = await Character.findOne({
    character_id: characterId,
  }).exec();
  if (!character) {
    return res.status(404).json({ errorMessage: "캐릭터 조회에 실패하였습니다." });
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
    return res.status(404).json({ errorMessage: "캐릭터 조회에 실패하였습니다." });
  }

  await Character.deleteOne({ character_id: characterId }).exec();

  return res.status(200).json({
    message: `캐릭터 ‘${character.name}’를 삭제하였습니다.`,
  });
});

// 도전 요구 사항 ----------------------------------------------------------------------------------------------------------

/* 캐랙터가 장착한 아이템 목록 조회 API */
router.get("/characters/:characterId/items", async (req, res) => {
  const { characterId } = req.params;
  const character = await Character.findOne({ character_id: characterId }).populate("equippedItems").exec();

  if (!character) {
    return res.status(404).json({ errorMessage: "캐릭터 조회에 실패하였습니다." });
  }

  const items = character.equippedItems.map((item) => ({
    item_code: item.item_code,
    item_name: item.item_name,
  }));
  return res.status(200).json(items);
});

/* 아이템 장착 API */
router.post("/characters/:characterId/equip", async (req, res) => {
  const { characterId } = req.params;
  const { item_code } = req.body;

  const character = await Character.findOne({ character_id: characterId }).populate("equippedItems").exec();

  if (!character) {
    return res.status(404).json({ errorMessage: "캐릭터 조회에 실패하였습니다." });
  }

  const isItemEquipped = character.equippedItems.some((item) => item.item_code === item_code);

  if (isItemEquipped) {
    return res.status(400).json({ errorMessage: "이미 장착한 아이템입니다." });
  }

  const itemToEquip = await Item.findOne({ item_code }).exec();

  if (!itemToEquip) {
    return res.status(404).json({ errorMessage: "아이템을 찾을 수 없습니다." });
  }

  character.health += itemToEquip.item_stat.health ?? 0;
  character.power += itemToEquip.item_stat.power ?? 0;
  character.equippedItems.push(itemToEquip);

  await character.save();

  return res.status(200).json({
    message: "아이템을 장착했습니다.",
    character: {
      name: character.name,
      health: character.health,
      power: character.power,
      equippedItems: character.equippedItems.map((item) => ({ item_code: item.item_code, item_name: item.item_name })),
    },
  });
});

/* 아이템 탈착 API */
router.post("/characters/:characterId/unequip", async (req, res) => {
  const { characterId } = req.params;
  const { item_code } = req.body;

  const character = await Character.findOne({ character_id: characterId }).populate("equippedItems").exec();

  if (!character) {
    return res.status(404).json({ errorMessage: "캐릭터 조회에 실패하였습니다." });
  }

  const itemIndex = character.equippedItems.findIndex((item) => item.item_code === item_code);

  if (itemIndex === -1) {
    return res.status(400).json({ errorMessage: "장착되지 않은 아이템입니다." });
  }

  const itemToUnequip = character.equippedItems[itemIndex];
  character.health -= itemToUnequip.item_stat.health ?? 0;
  character.power -= itemToUnequip.item_stat.power ?? 0;

  character.equippedItems.splice(itemIndex, 1);
  await character.save();

  return res.status(200).json({
    message: "아이템을 탈착했습니다.",
    character: {
      name: character.name,
      health: character.health,
      power: character.power,
      equippedItems: character.equippedItems.map((item) => ({ item_code: item.item_code, item_name: item.item_name })),
    },
  });
});

export default router;
