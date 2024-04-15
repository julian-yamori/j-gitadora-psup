"use client";

import { Stack } from "@mui/material";
import React, { useRef, useState } from "react";
import {
  ScoreListDto,
  scoreListDtoSchema,
} from "../../db/score_list/score_list_dto";
import { ScoreFilter } from "../../domain/score_query/score_filter";
import { ScoreOrder } from "../../domain/score_query/score_order";
import FilterForm from "./_filter_form/filter_form";
import ScoresTable from "./scores_table";
import assertResponseOk from "../_util/assert_response_ok";
import { useShowLoadingScreen } from "../../components/loading_screen";

const PAGE_SIZE = 50;

/** 譜面クエリ画面の最上位クライアントコンポーネント */
export default function ClientRoot() {
  const [scoresDto, setScoresDto] = useState<ScoreListDto>();
  const [filter, setFilter] = useState<ScoreFilter>();
  const [order, setOrder] = useState<ScoreOrder>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const tableTopRef = useRef<HTMLDivElement>(null);
  const showLoadingScreen = useShowLoadingScreen();

  const handleFormSubmit = (newFilter: ScoreFilter) => {
    setFilter(newFilter);
    setPageIndex(0);

    showLoadingScreen(
      (async () => {
        setScoresDto(await fetchSearch(newFilter, order, 0));
      })(),
    );
  };
  const handleOrderChanged = (newOrder: ScoreOrder) => {
    setOrder(newOrder);
    setPageIndex(0);
    if (filter) {
      showLoadingScreen(
        (async () => {
          setScoresDto(await fetchSearch(filter, newOrder, 0));
        })(),
      );
    }
  };
  const handlePageChanged = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
    if (filter) {
      showLoadingScreen(
        (async () => {
          setScoresDto(await fetchSearch(filter, order, newPageIndex));
          scrollToTableTop(tableTopRef);
        })(),
      );
    }
  };

  return (
    <Stack spacing={2}>
      <FilterForm onSubmit={handleFormSubmit} />
      <div ref={tableTopRef} />
      <ScoresTable
        scoresDto={scoresDto}
        order={order}
        pageIndex={pageIndex}
        rowsPerPage={PAGE_SIZE}
        onOrderChange={handleOrderChanged}
        onPageChange={handlePageChanged}
      />
    </Stack>
  );
}

async function fetchSearch(
  filter: ScoreFilter,
  order: ScoreOrder,
  pageIndex: number,
): Promise<ScoreListDto> {
  const query = {
    filter,
    order,
    paging: { skip: pageIndex * PAGE_SIZE, take: PAGE_SIZE },
  };

  const response = assertResponseOk(
    await fetch("api/scores", {
      method: "POST",
      body: JSON.stringify(query),
    }),
  );

  const json = await response.text();
  return scoreListDtoSchema.parse(JSON.parse(json));
}

function scrollToTableTop(tableTopRef: React.RefObject<HTMLDivElement>) {
  const refCurrent = tableTopRef.current;
  if (refCurrent) {
    refCurrent.scrollIntoView();
  }
}
