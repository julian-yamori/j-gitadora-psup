"use client";

import { ScoreListDto } from "@/db/score_list/score_list_dto";
import { ScoreOrder } from "@/domain/score_query/score_order";
import { Stack } from "@mui/material";
import { useState } from "react";
import FilterForm from "./_filter_form/filter_form";
import ScoresTable from "./scores_table";

/** 譜面クエリ画面の最上位クライアントコンポーネント */
export default function ClientRoot() {
  const [scores, setScores] = useState<ReadonlyArray<ScoreListDto>>([]);
  const [order, setOrder] = useState<ScoreOrder>();

  const handleFormSearched = (s: ReadonlyArray<ScoreListDto>) => {
    setScores(s);
  };

  const handleOrderChanged = (newOrder: ScoreOrder) => {
    setOrder(newOrder);
  };

  return (
    <Stack spacing={2}>
      <FilterForm onSearched={handleFormSearched} />
      <ScoresTable
        scores={scores}
        order={order}
        onOrderChange={handleOrderChanged}
      />
    </Stack>
  );
}
