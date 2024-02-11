import assertResponseOk from "@/app/_util/assert_response_ok";
import getRefNonNull from "@/app/_util/get_ref_non_null";
import AchievementInputView from "@/components/controls/achievement_input_view";
import LvInputView from "@/components/controls/lv_input_view";
import {
  FailedSnackbar,
  useFailedSnackbarState,
} from "@/components/snackbar/failed_snackbar";
import {
  ScoreListDto,
  verifyScoreListDtoFromUnknown,
} from "@/db/score_list/score_list_dto";
import {
  HOT,
  OTHER,
  SkillType,
  skillTypeSchema,
} from "@/domain/track/skill_type";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Rating,
  Stack,
  Switch,
} from "@mui/material";
import { ReactNode, useRef } from "react";
import {
  FilterItemState,
  minMaxNumberChangeHandler,
  useFilterItemState,
} from "./filter_item_state";

export default function FilterForm({
  onSearched,
}: {
  onSearched: (scores: ReadonlyArray<ScoreListDto>) => unknown;
}) {
  const form = useRef<HTMLFormElement>(null);
  const skillTypeState = useFilterItemState<SkillType>(HOT);
  const lvState = useFilterItemState<[string, string]>(["", ""]);
  const likeState = useFilterItemState<number | undefined>(undefined);
  const achievementState = useFilterItemState<[string, string]>(["", ""]);
  const isOpenState = useFilterItemState<boolean>(true);
  const snackbarState = useFailedSnackbarState();

  const handleSubmit = async () => {
    const formCurrent = getRefNonNull(form);
    if (!formCurrent.reportValidity()) return;

    const filtered = anyFiltered(
      skillTypeState,
      lvState,
      likeState,
      achievementState,
      isOpenState,
    );

    if (!filtered) {
      snackbarState.show("有効な検索条件が入力されていません。");
      return;
    }

    const response = assertResponseOk(
      await fetch("api/scores", {
        method: "POST",
        body: new FormData(formCurrent),
      }),
    );

    const json = await response.text();
    const scores = verifyResponse(JSON.parse(json));
    onSearched(scores);
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <form ref={form} onSubmit={(e) => e.preventDefault()}>
        <Stack spacing={2}>
          <FilterItem
            state={skillTypeState}
            checkName="enable_skilltype"
            control={<SkillTypeControl state={skillTypeState} />}
          />
          <FilterItem
            state={lvState}
            checkName="enable_lv"
            control={<LvControl state={lvState} />}
            label="Lv"
          />
          <FilterItem
            state={likeState}
            checkName="enable_like"
            control={<LikeControl state={likeState} />}
            label="好み"
          />
          <FilterItem
            state={achievementState}
            checkName="enable_achievement"
            label="達成率"
            control={<AchievementControl state={achievementState} />}
          />
          <FilterItem
            state={isOpenState}
            checkName="enable_isopen"
            control={<IsOpenControl state={isOpenState} />}
          />
          <Button variant="contained" onClick={handleSubmit}>
            検索
          </Button>
        </Stack>
      </form>
      <FailedSnackbar state={snackbarState} />
    </Paper>
  );
}

function FilterItem<V>({
  state,
  checkName,
  control,
  label,
}: {
  state: FilterItemState<V>;
  checkName: string;
  control: ReactNode;
  label?: string;
}) {
  return (
    <Stack direction="row" alignItems="center">
      <FormControlLabel
        label={label}
        control={
          <Checkbox
            name={checkName}
            checked={state.enabled}
            onChange={(e) => state.setEnabled(e.target.checked)}
          />
        }
      />

      {control}
    </Stack>
  );
}

function SkillTypeControl({ state }: { state: FilterItemState<SkillType> }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = skillTypeSchema.parse(Number(e.target.value));
    state.setValue(v);
  };

  const disabled = !state.enabled;

  return (
    <RadioGroup
      name="skilltype"
      value={state.value}
      onChange={handleChange}
      row
    >
      <FormControlLabel
        value={HOT}
        label="HOT"
        control={<Radio />}
        disabled={disabled}
      />
      <FormControlLabel
        value={OTHER}
        label="OTHER"
        control={<Radio />}
        disabled={disabled}
      />
    </RadioGroup>
  );
}

function LvControl({ state }: { state: FilterItemState<[string, string]> }) {
  const [handleChangeMin, handleChangeMax] = minMaxNumberChangeHandler(state);

  const disabled = !state.enabled;

  return (
    <>
      <LvInputView
        name="lv_min"
        value={state.value[0]}
        onChange={handleChangeMin}
        disabled={disabled}
      />
      〜
      <LvInputView
        name="lv_max"
        value={state.value[1]}
        onChange={handleChangeMax}
        disabled={disabled}
      />
    </>
  );
}

function LikeControl({
  state,
}: {
  state: FilterItemState<number | undefined>;
}) {
  return (
    <Rating
      name="like"
      value={state.value}
      onChange={(_, v) => state.setValue(v ?? undefined)}
      disabled={!state.enabled}
    />
  );
}

function AchievementControl({
  state,
}: {
  state: FilterItemState<[string, string]>;
}) {
  const [handleChangeMin, handleChangeMax] = minMaxNumberChangeHandler(state);

  const disabled = !state.enabled;

  return (
    <>
      <AchievementInputView
        name="achievement_min"
        value={state.value[0]}
        onChange={handleChangeMin}
        disabled={disabled}
      />
      〜
      <AchievementInputView
        name="achievement_max"
        value={state.value[1]}
        onChange={handleChangeMax}
        disabled={disabled}
      />
    </>
  );
}

function IsOpenControl({ state }: { state: FilterItemState<boolean> }) {
  const label = state.value ? "開放済み" : "未開放";

  const disabled = !state.enabled;

  return (
    <FormControlLabel
      disabled={disabled}
      control={
        <Switch
          name="isopen"
          checked={state.value}
          onChange={(_, v) => state.setValue(v)}
        />
      }
      label={label}
    />
  );
}

function anyFiltered(
  skillTypeState: FilterItemState<SkillType>,
  lvState: FilterItemState<[string, string]>,
  likeState: FilterItemState<number | undefined>,
  achievementState: FilterItemState<[string, string]>,
  isOpenState: FilterItemState<boolean>,
): boolean {
  if (skillTypeState.enabled) {
    return true;
  }

  if (isRangeFiltered(lvState)) {
    return true;
  }

  if (likeState.enabled) {
    return true;
  }

  if (isRangeFiltered(achievementState)) {
    return true;
  }

  if (isOpenState.enabled) {
    return true;
  }

  return false;
}

function isRangeFiltered(state: FilterItemState<[string, string]>): boolean {
  return state.enabled && (state.value[0] !== "" || state.value[1] !== "");
}

function verifyResponse(value: unknown): ScoreListDto[] {
  if (!(value instanceof Array)) {
    throw Error("response is not array");
  }

  return value.map(verifyScoreListDtoFromUnknown);
}
