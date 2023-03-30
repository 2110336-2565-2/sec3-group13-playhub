import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Radio,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import NormalButton from "../public/CommonButton";
import CloseIcon from "@mui/icons-material/Close";
import { SyntheticEvent, useEffect, useState, useContext, useRef } from "react";
import { RATING } from "enum/RATING";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import DescriptionTextField from "../public/DescriptionTextField";
import { CHAR_LIMIT } from "enum/INPUT_LIMIT";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { validation } from "@/types/Validation";
import { validateTextField } from "@/utilities/validation";
import { CreateReview, GetReviewByReviewerAndAppointmentId, UpdateReview } from "@/services/Review";
import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { PAGE_PATHS } from "enum/PAGES";
import { useRouter } from "next/router";

type props = {
  openModal: boolean;
  handleCloseModal: () => void;
  appointmentId: number;
  isEditing: boolean;
};

type State = {
  ratingScore: boolean;
  ratingDescription: boolean;
};

export default function RateDialog(props: props) {
  const [ratingScore, setRatingScore] = useState<number>(0);
  const [ratingDescription, setRatingDescription] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [state, setState] = useState<State>({
    ratingScore: false,
    ratingDescription: false,
  });
  const router = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const isRatingScoreErr: boolean = ratingScore === 0;
  const ratingScoreErrMsg: string = "*Rate score can’t be blank";
  const ratingDescriptionError: validation = validateTextField(
    ratingDescription,
    CHAR_LIMIT.MIN_DESCRIPTION,
    CHAR_LIMIT.MAX_DESCRIPTION
  );
  const [reviewId, setReviewId] = useState<number | null>(null);

  function generateRateLabel(): string {
    switch (ratingScore) {
      case 1: {
        return RATING.ONE;
      }
      case 2: {
        return RATING.TWO;
      }
      case 3: {
        return RATING.THREE;
      }
      case 4: {
        return RATING.FOUR;
      }
      case 5: {
        return RATING.FIVE;
      }
      default: {
        return "";
      }
    }
  }

  function handleCloseAndResetModal(): void {
    props.handleCloseModal();
    setRatingScore(0);
    setRatingDescription("");
    setIsAnonymous(false);
    setState({
      ratingScore: false,
      ratingDescription: false,
    });
  }

  function handleRatingScoreChange(
    event: SyntheticEvent<Element, Event>,
    newScore: number | null
  ): void {
    if (newScore) {
      setState({
        ...state,
        ratingScore: false,
      });
      setRatingScore(newScore);
    }
  }

  function handleRatingDescriptionChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setState({
      ...state,
      ratingDescription: false,
    });
    setRatingDescription(event.target.value);
  }

  function handleIsAnonymousChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setIsAnonymous(event.target.checked);
  }

  function handleSubmitRating(): void {
    setState({
      ratingScore: true,
      ratingDescription: true,
    });

    if (!isRatingScoreErr && !ratingDescriptionError.err) {
      if (props.isEditing) {
        UpdateReview(supabaseClient, reviewId!, ratingDescription, ratingScore, isAnonymous);
      } else {
        CreateReview(
          supabaseClient,
          ratingDescription,
          ratingScore,
          props.appointmentId,
          userStatus.user!.userId,
          isAnonymous
        );
      }
      handleCloseAndResetModal();
      router.push(PAGE_PATHS.SELECT_RATE);
    }
  }

  useEffect(() => {
    console.log("use effect");
    if (userStatus.user) {
      GetReviewByReviewerAndAppointmentId(
        supabaseClient,
        userStatus.user.userId,
        props.appointmentId
      )
        .then((review) => {
          if (review) {
            setRatingScore(review.score);
            setRatingDescription(review.description);
            setIsAnonymous(review.isAnonymous);
            setReviewId(review.id);
          }
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    }
  }, [supabaseClient, userStatus.user]);

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={props.openModal}
        onClose={handleCloseAndResetModal}
      >
        <DialogTitle>
          <Stack direction="row">
            <Box display="flex" sx={{ flexGrow: 1, alignItems: "center" }}>
              <Typography variant="h3">Rate Appointment</Typography>
            </Box>
            <IconButton onClick={handleCloseAndResetModal} sx={{ padding: 0 }}>
              <CloseIcon fontSize="large" color="secondary" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={0} alignItems="center">
            <Stack spacing={3} style={{ width: "25vw", minWidth: "400px" }}>
              {/* Rating */}
              <Stack spacing={0}>
                <Stack direction="row" spacing={0}>
                  <Rating
                    value={ratingScore}
                    onChange={handleRatingScoreChange}
                    defaultValue={0}
                    size="large"
                    icon={
                      <StarIcon
                        style={{ width: "50px", height: "50px" }}
                        color="secondary"
                      ></StarIcon>
                    }
                    emptyIcon={
                      <StarOutlineIcon
                        style={{ width: "50px", height: "50px" }}
                        color="secondary"
                      ></StarOutlineIcon>
                    }
                  />
                  <Stack style={{ alignItems: "center", justifyContent: "center", width: "15vw" }}>
                    <Typography variant="body1">{generateRateLabel()}</Typography>
                  </Stack>
                </Stack>
                <FormHelperText error>
                  {state.ratingScore && isRatingScoreErr && ratingScoreErrMsg}
                  {"\u00A0"}
                </FormHelperText>
              </Stack>

              {/* Description */}
              <Box style={{ width: "25vw", minWidth: "400px", marginTop: 0 }}>
                <DescriptionTextField
                  placeholder="How do you feel about this activity? (Optional)"
                  value={ratingDescription}
                  handleValueChange={handleRatingDescriptionChange}
                  char_limit={CHAR_LIMIT.MAX_DESCRIPTION}
                  isErr={state.ratingDescription && ratingDescriptionError.err}
                  errMsg={ratingDescriptionError.msg}
                  height={7}
                />
              </Box>
            </Stack>

            {/* Check Box */}
            <Box style={{ width: "25vw", minWidth: "400px" }}>
              <FormControlLabel
                value="anonymous"
                control={
                  <Checkbox
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={isAnonymous}
                    onChange={handleIsAnonymousChange}
                  />
                }
                label="Anonymous Rate"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <NormalButton label="Submit" onClick={handleSubmitRating} />
        </DialogActions>
      </Dialog>
    </>
  );
}
