import { Box, FormHelperText, Stack, TextField, Typography } from "@mui/material";

type props = {
  header?: string;
  label?: string;
  placeholder?: string;
  value: string;
  handleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  isMultiLine?: boolean;
  char_limit?: number;
  isErr: boolean;
  errMsg: string;
  mediumSize?: boolean;
};

const helperText = {
  display: "flex",
  flexDirection: "row-reverse",
  justifyContent: "space-between",
};

export default function InputTextBox(props: props) {
  const exceedChar: boolean = props.char_limit ? props.value.length > props.char_limit : false;

  return (
    <>
      <Typography variant="body1">{props?.header}</Typography>
      <TextField
        label={props?.label}
        placeholder={props?.placeholder}
        error={props.isErr || exceedChar}
        value={props.value}
        onChange={props.handleValueChange}
        multiline={props.isMultiLine || false}
        rows={props.isMultiLine ? 4 : 1}
        fullWidth
        size={props.mediumSize ? "medium" : "small"}
      />
      <Box sx={helperText}>
        <FormHelperText error={exceedChar}>
          {props.char_limit && `${props.value.length}/${props.char_limit}`}
        </FormHelperText>
        {props.isErr && <FormHelperText error>{props.errMsg}</FormHelperText>}
      </Box>
    </>
  );
}
