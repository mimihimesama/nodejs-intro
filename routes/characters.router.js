import express from "express";
import { Character, Item } from "../schemas/characters.schema.js";

const router = express.Router();

/* 캐릭터 생성 API */
router.post("/characters", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ errorMessage: "이름이 입력되지 않았습니다." });
  }

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
});

/* 캐릭터 상세 조회 API */
router.get("/characters/:characterId", async (req, res) => {
  const { characterId } = req.params;

  const character = await Character.findOne({
    character_id: characterId,
  }).exec();
  if (!character) {
    return res.status(404).json({ message: "캐릭터 조회에 실패하였습니다." });
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
    return res.status(404).json({ message: "캐릭터 조회에 실패하였습니다." });
  }

  await Character.deleteOne({ character_id: characterId }).exec();

  return res.status(200).json({
    message: `캐릭터 ‘${character.name}’를 삭제하였습니다.`,
  });
});

/* 아이템 생성 API */
router.post("/items", async (req, res) => {
  const { item_code, item_name, item_stat } = req.body;

  if (!item_code || !item_name || !item_stat) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  }

  const item = new Item({ item_code, item_name, item_stat });
  await item.save();
  return res.status(201).json({ message: "아이템이 생성되었습니다." });
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
    return res.status(404).json({ message: "아이템 조회에 실패하였습니다." });
  }

  return res.status(200).json({
    item_code: item.item_code,
    item_name: item.item_name,
    item_stat: item.item_stat,
  });
});

/* 아이템 수정 API */
router.patch("/items/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const { item_name, item_stat } = req.body;

  const item = await Item.findOne({ item_code: itemId });

  if (!item) {
    return res.status(404).json({ message: "아이템을 찾을 수 없습니다." });
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
});

export default router;