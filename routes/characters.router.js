import express from "express";
import Character from "../schemas/characters.schema.js";
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

export default router;
