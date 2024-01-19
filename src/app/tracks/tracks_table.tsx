// "use client";

import { TrackListDto, TrackListScoreDto } from "@/db/track_list_dto";
import {
  ADVANCED,
  BASIC,
  Difficulty,
  EXTREME,
  MASTER,
} from "@/domain/track/difficulty";
import { openTypeToStr } from "@/domain/track/open_type";
import { lvToString } from "@/domain/track/track";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";

function scoreLvText(
  scores: ReadonlyArray<TrackListScoreDto>,
  difficulty: Difficulty,
): string {
  const lvObj = scores.find((d) => d.difficulty === difficulty);
  if (lvObj === undefined) return "---";

  return lvToString(lvObj.lv);
}

export default function TracksTable({
  tracks,
}: {
  tracks: ReadonlyArray<TrackListDto>;
}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>曲名</TableCell>
            <TableCell>BASIC</TableCell>
            <TableCell>ADVANCED</TableCell>
            <TableCell>EXTREME</TableCell>
            <TableCell>MASTER</TableCell>
            <TableCell>LONG</TableCell>
            <TableCell>開放タイプ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracks.map((track) => (
            <TableRow key={track.id}>
              <TableCell>
                <Link href={`/tracks/${track.id}`}>{track.title}</Link>
              </TableCell>
              <TableCell>{scoreLvText(track.scores, BASIC)}</TableCell>
              <TableCell>{scoreLvText(track.scores, ADVANCED)}</TableCell>
              <TableCell>{scoreLvText(track.scores, EXTREME)}</TableCell>
              <TableCell>{scoreLvText(track.scores, MASTER)}</TableCell>
              <TableCell>{track.long ? "LONG" : undefined}</TableCell>
              <TableCell>{openTypeToStr(track.openType)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
