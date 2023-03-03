import { FormHelperText, InputAdornment, Stack, TextField } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

type props = {
  placeholder: string;
  value: string;
  handleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  isErr: boolean;
  errMsg: string;
};

export default function EmailTextField(props: props) {
  return (
    <>
      <Stack spacing={1}>
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
                <EmailIcon color={props.isErr ? "error" : "secondary"} />
              </InputAdornment>
            ),
          }}
        />
        <FormHelperText error>
          {props.isErr && props.errMsg}
          {"\u00A0"}
        </FormHelperText>
      </Stack>
    </>
  );
}
