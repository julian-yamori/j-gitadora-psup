import { Divider, Paper, Typography } from "@mui/material";
import prismaClient from "../../db/prisma_client";
import { ScoreListDtoRow } from "../../db/score_list/score_list_dto";
import queryScoreList from "../../db/score_list/score_list_query_service";
import DashboardScoresView from "./dashboard_scores_view";
import { HOT } from "../../domain/track/skill_type";

/** ダッシュボードの、達成率が一定未満の曲リスト */
export default async function UnskilledList() {
  const scores = await loadScores();

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h4">未達成リスト</Typography>
      <Divider />
      <DashboardScoresView scores={scores} />
    </Paper>
  );
}

async function loadScores(): Promise<ReadonlyArray<ScoreListDtoRow>> {
  return (
    await queryScoreList(prismaClient, {
      filter: {
        nodeType: "Group",
        logic: "and",
        nodes: [
          {
            nodeType: "Number",
            target: "achievement",
            range: { rangeType: "Max", value: 0.85 },
          },
          {
            nodeType: "Number",
            target: "lv",
            range: { rangeType: "MinMax", min: 5.3, max: 6.2 },
          },
          {
            nodeType: "Group",
            logic: "or",
            nodes: [
              // HOT : like >= 2
              {
                nodeType: "Group",
                logic: "and",
                nodes: [
                  {
                    nodeType: "Number",
                    target: "skillType",
                    range: { rangeType: "Eq", value: HOT },
                  },
                  {
                    nodeType: "Number",
                    target: "like",
                    range: { rangeType: "Min", value: 2 },
                  },
                ],
              },
              // OTHER : like >= 4
              {
                nodeType: "Number",
                target: "like",
                range: { rangeType: "Min", value: 4 },
              },
            ],
          },
        ],
      },
      order: [{ target: "lv", direction: "desc" }],
      paging: {},
    })
  ).rows;
}
