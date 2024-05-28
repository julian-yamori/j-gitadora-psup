import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { SkillRangeScore } from "../../db/skill_range_score/skill_range_score";
import { SkillType } from "../../domain/track/skill_type";
import Link from "next/link";
import { achievementToPercent } from "../../domain/track/achievement";
import { skillPointToDisplay } from "../../domain/track/user_track";
import { lvToString } from "../../domain/track/track";
import {
  DifficultyPaper,
  SkillTypePaper,
} from "../../components/track_info/type_papers";

export default function ViewBySkillType({
  skillType,
  scores,
}: {
  skillType: SkillType;
  scores: ReadonlyArray<SkillRangeScore>;
}) {
  return (
    <Paper elevation={2} sx={{ padding: 1 }}>
      <SkillTypePaper skillType={skillType} />
      <TableContainer>
        <TableHead>
          <TableCell>順位</TableCell>
          <TableCell>曲名</TableCell>
          <TableCell>難易度</TableCell>
          <TableCell>SkillPoint</TableCell>
          <TableCell>達成率</TableCell>
          <TableCell>Lv</TableCell>
        </TableHead>
        <TableBody>
          {scores.map((score, i) => (
            <Row
              key={`${score.trackId}_${score.difficulty}`}
              rank={i + 1}
              score={score}
            />
          ))}
        </TableBody>
      </TableContainer>
    </Paper>
  );
}

function Row({ rank, score }: { rank: number; score: SkillRangeScore }) {
  const { trackId, title, difficulty, skillPoint, achievement, lv } = score;

  return (
    <TableRow>
      <TableCell>{rank}</TableCell>
      <TableCell>
        <Link href={`/tracks/${trackId}`}>{title}</Link>
      </TableCell>
      <TableCell>
        <DifficultyPaper difficulty={difficulty} />
      </TableCell>
      <TableCell>{skillPointToDisplay(skillPoint)}</TableCell>
      <TableCell>{achievementToPercent(achievement)}</TableCell>
      <TableCell>{lvToString(lv)}</TableCell>
    </TableRow>
  );
}
