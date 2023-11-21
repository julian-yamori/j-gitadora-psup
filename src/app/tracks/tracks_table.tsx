// "use client";

import { TrackListDto, TrackListDtoLvs } from "@/db/track_list_dto";
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

function difficultyLvText(
  difficulties: ReadonlyArray<TrackListDtoLvs>,
  difficulty: Difficulty,
): string {
  const lvObj = difficulties.find((d) => d.difficulty === difficulty);
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
              <TableCell>{track.title}</TableCell>
              <TableCell>
                {difficultyLvText(track.difficulties, BASIC)}
              </TableCell>
              <TableCell>
                {difficultyLvText(track.difficulties, ADVANCED)}
              </TableCell>
              <TableCell>
                {difficultyLvText(track.difficulties, EXTREME)}
              </TableCell>
              <TableCell>
                {difficultyLvText(track.difficulties, MASTER)}
              </TableCell>
              <TableCell>{track.long ? "LONG" : undefined}</TableCell>
              <TableCell>{openTypeToStr(track.openType)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}