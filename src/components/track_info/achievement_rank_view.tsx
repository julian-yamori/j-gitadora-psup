import { Typography } from "@mui/material";
import {
  ACHIEVEMENT_RANK_A,
  ACHIEVEMENT_RANK_B,
  ACHIEVEMENT_RANK_C,
  ACHIEVEMENT_RANK_S,
  ACHIEVEMENT_RANK_SS,
  AchievementRank,
  achievementRankToStr,
} from "../../domain/track/achievement";
import neverError from "../../utils/never_error";

export function AchievementRankView({
  rank,
}: {
  rank: AchievementRank | undefined;
}) {
  if (rank === undefined) {
    return null;
  }

  return (
    <Typography
      sx={{
        color: rankToColor(rank),
        fontSize: "175%",
        fontWeight: "bold",
        textShadow: "1px 1px 1px black",
      }}
    >
      {achievementRankToStr(rank)}
    </Typography>
  );
}

function rankToColor(rank: AchievementRank): string {
  switch (rank) {
    case ACHIEVEMENT_RANK_SS:
      return "#d3a52e";
    case ACHIEVEMENT_RANK_S:
      return "#fff060";
    case ACHIEVEMENT_RANK_A:
      return "#ff2f6a";
    case ACHIEVEMENT_RANK_B:
      return "#ff9f3a";
    case ACHIEVEMENT_RANK_C:
      return "#00e439";
    default:
      throw neverError(rank);
  }
}
