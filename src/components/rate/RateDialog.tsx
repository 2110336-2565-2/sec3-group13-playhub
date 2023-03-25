import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Radio, Rating, Stack, Typography } from "@mui/material";
import NormalButton from "../public/CommonButton";
import CloseIcon from "@mui/icons-material/Close";
import { SyntheticEvent, useEffect, useState } from "react";
import { RATING } from "enum/RATING";
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import DescriptionTextField from "../public/DescriptionTextField";
import { CHAR_LIMIT } from "enum/INPUT_LIMIT";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

type props = {
  openModal: boolean;
  handleCloseModal: () => void;
};

export default function RateDialog(props: props) {
  const [ratingScore, setRatingScore] = useState<number>(0);
  const [ratingDescription, setRatingDescription] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

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
        return ""
      }
    }
  }

  function handleRatingScoreChange(event: SyntheticEvent<Element, Event>, newScore: number | null): void {
    if (newScore) {
      setRatingScore(newScore);
    }
  }

  function handleRatingDescriptionChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setRatingDescription(event.target.value);
  }

  function handleIsAnonymousChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setIsAnonymous(event.target.checked)
  }

  function handleSubmitRating(): void {
    // add submit rating service here
    props.handleCloseModal();
  }

  useEffect(() => {
    // require retreiving rating imformation and set them
    //setRatingScore(2); // this is mocking score, need to be set by some services
    //setRatingDescription("I love it"); // this is mocking description, need to be set by some services
    //setIsAnonymous(true); // this is mocking anonymous, need to be set by some services
  });

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={props.openModal}
        onClose={props.handleCloseModal}
      >
        <DialogTitle>
          <Stack direction="row">
            <Box display="flex" sx={{ flexGrow: 1, alignItems: "center" }}>
              <Typography variant="h3">Rate Appointment</Typography>
            </Box>
            <IconButton onClick={props.handleCloseModal} sx={{ padding: 0 }}>
              <CloseIcon fontSize="large" color="secondary" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={0} alignItems="center">
            <Stack spacing={3} style={{ width: "25vw" }}>
              {/* Rating */}
              <Stack direction="row" spacing={0}>
                <Rating
                  value={ratingScore}
                  onChange={handleRatingScoreChange}
                  defaultValue={0}
                  size="large"
                  icon={<StarIcon style={{ width: "40px", height: "40px" }} color="secondary"></StarIcon>}
                  emptyIcon={<StarOutlineIcon style={{ width: "40px", height: "40px" }} color="secondary"></StarOutlineIcon>}
                />
                <Stack style={{ alignItems: "center", justifyContent: "center", width: "15vw" }}>
                  <Typography variant="body1">{generateRateLabel()}</Typography>
                </Stack>
              </Stack>

              {/* Description */}
              <Box style={{ width: "25vw" }}>
                <DescriptionTextField
                  placeholder="How do you feel about this activity? (Optional)"
                  value={ratingDescription}
                  handleValueChange={handleRatingDescriptionChange}
                  char_limit={CHAR_LIMIT.MAX_DESCRIPTION}
                  isErr={false}
                  errMsg=""
                  height={7}
                />
              </Box>
            </Stack>

            {/* Check Box */}
            <Box style={{ width: "25vw" }}>
              <FormControlLabel
                value="anonymous"
                control={<Checkbox
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<RadioButtonCheckedIcon />}
                  checked={isAnonymous}
                  onChange={handleIsAnonymousChange}
                />}
                label="Anonymous Rate" />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <NormalButton label="Submit" onClick={handleSubmitRating} />
        </DialogActions>
      </Dialog>
    </>
  )
}