"use client";

import {
  ScoreListDto,
  scoreListDtoSchema,
} from "@/db/score_list/score_list_dto";
import { ScoreFilter } from "@/domain/score_query/score_filter";
import { ScoreOrder } from "@/domain/score_query/score_order";
import { Stack } from "@mui/material";
import { useState } from "react";
import { z } from "zod";
import FilterForm from "./_filter_form/filter_form";
import ScoresTable from "./scores_table";
import assertResponseOk from "../_util/assert_response_ok";

/** 譜面クエリ画面の最上位クライアントコンポーネント */
export default function ClientRoot() {
  const [scores, setScores] = useState<ReadonlyArray<ScoreListDto>>([]);
  const [order, setOrder] = useState<ScoreOrder>();

  const handleFormSubmit = async (f: ScoreFilter) => {
    setScores(await fetchSearch(f));
  };
  const handleOrderChanged = (newOrder: ScoreOrder) => {
    setOrder(newOrder);
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

async function fetchSearch(filter: ScoreFilter): Promise<ScoreListDto[]> {
  const response = assertResponseOk(
    await fetch("api/scores", {
      method: "POST",
      body: JSON.stringify(filter),
    }),
  );

  const json = await response.text();
  return responseSchema.parse(JSON.parse(json));
}
