import { Paper } from "@mui/material";
import {
  HOT,
  OTHER,
  SkillType,
  skillTypeToStr,
} from "../../domain/track/skill_type";
import neverError from "../../utils/never_error";
import {
  ADVANCED,
  Difficulty,
  EXTREME,
  MASTER,
  BASIC,
  difficultyToStr,
} from "../../domain/track/difficulty";

/** SkillPoint の枠区分表記の Paper */
export function SkillTypePaper({ skillType }: { skillType: SkillType }) {
  const text = skillTypeToStr(skillType);
  switch (skillType) {
    case HOT:
      return <TagPaper text={text} bgcolor="#e00000" textColor="#ffff00" />;
    case OTHER:
      return <TagPaper text={text} bgcolor="#00c000" textColor="#ff0" />;
    default:
      throw neverError(skillType);
  }
}

/** 難易度表記の Paper */
export function DifficultyPaper({ difficulty }: { difficulty: Difficulty }) {
  return (
    <TagPaper
      text={difficultyToStr(difficulty)}
      bgcolor={difficultyColor(difficulty)}
      textColor="#000"
    />
  );
}

function difficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case BASIC:
      return "#5297ff";
    case ADVANCED:
      return "#beaf02;";
    case EXTREME:
      return "#e10035";
    case MASTER:
      return "#c800cf";
    default:
      throw neverError(difficulty);
  }
}

/** LONG 表記の Paper */
export function LongPaper() {
  return <TagPaper text="LONG" bgcolor="f4f" textColor="#fff" />;
}

/** EVENT 表記の Paper */
export function EventPaper() {
  return <TagPaper text="EVENT" bgcolor="afa" textColor="#000" />;
}

function TagPaper({
  text,
  bgcolor,
  textColor,
}: {
  text: string;
  bgcolor: string;
  textColor: string;
}) {
  return (
    <Paper
      sx={{
        color: textColor,
        bgcolor,
        padding: 0.8,
        fontWeight: "bold",
        textAlign: "center",
        width: "fit-content",
      }}
    >
      {text}
    </Paper>
  );
}
