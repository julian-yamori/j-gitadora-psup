import {
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AchievementInput from "./achievement_input";
import { achievementToRank } from "../../../domain/track/achievement";
import { Score, lvToString } from "../../../domain/track/track";
import {
  UserScore,
  skillPointToDisplay,
  trackSkillPoint,
  initialUserScore,
} from "../../../domain/track/user_track";
import { DifficultyPaper } from "../../../components/track_info/type_papers";
import { AchievementRankView } from "../../../components/track_info/achievement_rank_view";
import formKeyByScore from "../../api/tracks/form_key";

export function ScoreView({
  score,
  userScore,
  onValueChange,
  onAchievementValidChange,
}: {
  score: Score;
  userScore: UserScore | undefined;
  onValueChange: (d: UserScore) => unknown;
  onAchievementValidChange: (d: Difficulty, valid: boolean) => unknown;
}) {
  // UserScore が未定義なら初期値で代替
  const nonNullUserScore = userScore ?? initialUserScore(score);

  const rank = achievementToRank(nonNullUserScore.achievement);

  return (
    <Paper sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <DifficultyPaper difficulty={score.difficulty} />

        <Typography>LV {lvToString(score.lv)}</Typography>

        <Stack direction="row" alignItems="center" spacing={2}>
          <AchievementInput
            difficulty={score.difficulty}
            achievement={nonNullUserScore.achievement}
            failed={nonNullUserScore.failed}
            onValueChange={(v) =>
              onValueChange({ ...nonNullUserScore, achievement: v })
            }
            onValidChange={(v) => onAchievementValidChange(score.difficulty, v)}
          />
          <AchievementRankView rank={rank} />

          <FailedInput
            difficulty={score.difficulty}
            achievement={nonNullUserScore.achievement}
            failed={nonNullUserScore.failed}
            onChange={(v) => onValueChange({ ...nonNullUserScore, failed: v })}
          />
        </Stack>

        <Typography>
          SP{" "}
          {skillPointToDisplay(
            trackSkillPoint(score.lv, nonNullUserScore.achievement),
          )}
        </Typography>

        <TextField
          type="url"
          label="動画URL"
          name={formKeyByScore(score.difficulty, "movie_url")}
          value={nonNullUserScore.movieURL}
          onChange={(e) =>
            onValueChange({ ...nonNullUserScore, movieURL: e.target.value })
          }
          size="small"
          inputProps={{
            size: 43, // YoutubeのURLの長さ
          }}
        />
      </Stack>
    </Paper>
  );
}

function FailedInput({
  difficulty,
  achievement,
  failed,
  onChange,
}: {
  difficulty: Difficulty;
  achievement: number;
  failed: boolean;
  onChange: (value: boolean) => unknown;
}) {
  if (achievement !== 0) {
    return null;
  }

  return (
    <FormControlLabel
      label="Failed"
      control={
        <Checkbox
          name={formKeyByScore(difficulty, "failed")}
          checked={failed}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
        />
      }
    />
  );
}
