"use client";

import {
  ScoreListDto,
  scoreListDtoSchema,
} from "@/db/score_list/score_list_dto";
import { ScoreFilter } from "@/domain/score_query/score_filter";
import { ScoreOrder } from "@/domain/score_query/score_order";
import { ScoreQuery } from "@/domain/score_query/score_query";
import { Stack } from "@mui/material";
import { useState } from "react";
import { z } from "zod";
import FilterForm from "./_filter_form/filter_form";
import ScoresTable from "./scores_table";
import assertResponseOk from "../_util/assert_response_ok";

/** 譜面クエリ画面の最上位クライアントコンポーネント */
export default function ClientRoot() {
  const [scores, setScores] = useState<ReadonlyArray<ScoreListDto>>([]);
  const [filter, setFilter] = useState<ScoreFilter>();
  const [order, setOrder] = useState<ScoreOrder>([]);

  const handleFormSubmit = async (newFilter: ScoreFilter) => {
    setFilter(newFilter);
    setScores(await fetchSearch({ filter: newFilter, order }));
  };
  const handleOrderChanged = async (newOrder: ScoreOrder) => {
    setOrder(newOrder);
    if (filter) {
      setScores(await fetchSearch({ filter, order: newOrder }));
    }
  };

  return (
    <Stack spacing={2}>
      <FilterForm onSubmit={handleFormSubmit} />
      <ScoresTable
        scores={scores}
        order={order}
        onOrderChange={handleOrderChanged}
      />
    </Stack>
  );
}

const responseSchema = z.array(scoreListDtoSchema);

async function fetchSearch(query: ScoreQuery): Promise<ScoreListDto[]> {
  const response = assertResponseOk(
    await fetch("api/scores", {
      method: "POST",
      body: JSON.stringify(query),
    }),
  );

  const json = await response.text();
  return responseSchema.parse(JSON.parse(json));
}
