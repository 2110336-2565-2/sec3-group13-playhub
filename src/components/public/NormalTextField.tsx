import { Box, FormHelperText, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

type props = {
  header?: string;
  placeholder: string;
  value: string;
  handleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  char_limit?: number;
  isErr: boolean;
  errMsg: string;
};

const helperText = {
  display: "flex",
  flexDirection: "row-reverse",
  justifyContent: "space-between",
};

export default function NormalTextField(props: props) {
  const exceedChar: boolean = props.char_limit ? props.value.length > props.char_limit : false;

  return (
    <>
      <Stack spacing={1}>
        <Typography variant="body1">{props?.header}</Typography>
        <TextField
          sx={{ backgroundColor: "#ffffff" }}
          fullWidth
          placeholder={props.placeholder}
          value={props.value}
          error={props.isErr}
          onChange={props.handleValueChange}
          inputProps={{
            sx: {
              textAlign: "center",
              "&::placeholder": {
                textAlign: "center",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={helperText}>
          <FormHelperText error={exceedChar}>
            {props.char_limit && `${props.value.length}/${props.char_limit}`}
          </FormHelperText>
          <FormHelperText error>{props.isErr && props.errMsg}</FormHelperText>
        </Box>
      </Stack>
    </>
  );
}
