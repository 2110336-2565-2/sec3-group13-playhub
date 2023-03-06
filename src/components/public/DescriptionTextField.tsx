import { Box, FormHelperText, Stack, TextField, Typography } from "@mui/material";

type props = {
  header: string;
  placeholder: string;
  value: string;
  handleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  char_limit: number;
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
        <Box>
          <Typography variant="body1">{props?.header}</Typography>
          <TextField
            sx={{ backgroundColor: "#ffffff" }}
            fullWidth
            multiline
            rows={4}
            placeholder={props.placeholder}
            value={props.value}
            error={props.isErr}
            onChange={props.handleValueChange}
          />
        </Box>
        <Box sx={helperText}>
          <FormHelperText error={exceedChar}>
            {props.char_limit && `${props.value.length}/${props.char_limit}`}
          </FormHelperText>
          <FormHelperText error>
            {props.isErr && props.errMsg}
            {"\u00A0"}
          </FormHelperText>
        </Box>
      </Stack>
    </>
  );
}
