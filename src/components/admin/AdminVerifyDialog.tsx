import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { CHAR_LIMIT } from "enum/INPUT_LIMIT";
import React, { useEffect, useState } from "react";
import { UpdateUserNationalIdByUserId } from "@/services/User";
import { validation } from "@/types/Validation";
import { validateNationalIDCardNumber } from "@/utilities/validation";
import { NextRouter, useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import CommonButton from "../public/CommonButton";
import { IMaskInput } from "react-imask";

type props = {
  openModal: boolean;
  handleCloseModal: () => void;
};

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(function TextMaskCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="#-0000-00000-00-0"
      definitions={{
        "#": /[1-9]/,
      }}
      // inputRef={ref}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

export default function AdminVerifyDialog(props: props) {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();

  const [previewNationalIDCard, setPreviewNationalIDCard] = useState<string>("");
  const nationalIDCard: string = previewNationalIDCard.split("-").join("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    clearError();
    setPreviewNationalIDCard("");
  }, [props.openModal]);

  function verifyUser(): void {
    console.log("confirm button is clicked!!", nationalIDCard);

    const validate: validation = validateNationalIDCardNumber(nationalIDCard);
    if (validate.err) {
      setIsError(true);
      setErrMsg(validate.msg);
      return;
    }

    UpdateUserNationalIdByUserId(router.query.user_id as string, nationalIDCard, supabaseClient)
      .then((is_national_id_exist) => {
        if (is_national_id_exist) {
          setIsError(true);
          setErrMsg("This national ID number already exists.");
          return;
        }
        router.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleNationalIDCardChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    if (event.target.value.length > CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER + 4) return;
    setPreviewNationalIDCard(event.target.value);
    clearError();
  }

  function clearError(): void {
    setErrMsg("");
    setIsError(false);
  }

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={props.openModal}
        onClose={props.handleCloseModal}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h2">Verify this user</Typography>
            <IconButton onClick={props.handleCloseModal} sx={{ padding: 0 }}>
              <CloseIcon fontSize="large" color="secondary" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1} alignItems="center">
            <Typography align="center">National ID Number</Typography>
            <Box sx={{ width: "70%", margin: "auto" }}>
              <TextField
                placeholder="13 digits integer only"
                autoFocus
                error={isError}
                value={previewNationalIDCard}
                onChange={handleNationalIDCardChange}
                fullWidth
                InputProps={{
                  inputComponent: TextMaskCustom as any,
                }}
                inputProps={{
                  sx: {
                    textAlign: "center",
                    "&::placeholder": {
                      textAlign: "center",
                    },
                  },
                }}
              />
              <Box sx={{ marginTop: "10px" }}>
                <FormHelperText error>
                  {isError && errMsg}
                  {"\u00A0"}
                </FormHelperText>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <CommonButton label="Confirm" onClick={verifyUser} />
        </DialogActions>
      </Dialog>
    </>
  );
}
