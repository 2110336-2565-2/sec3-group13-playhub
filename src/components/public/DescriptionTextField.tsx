import { Box, FormHelperText, Stack, TextField, Typography } from "@mui/material";
import React from "react";

type props = {
  name?: string;
  header?: string;
  placeholder: string;
  value: string;
  handleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  char_limit?: number;
  isErr: boolean;
  errMsg: string;
  height?: number;
  disabled?: boolean;
  readOnly?: boolean;
};

const helperText = {
  display: "flex",
  flexDirection: "row-reverse",
  justifyContent: "space-between",
};

export default function NormalTextField(props: props) {
  const exceedChar: boolean = props.char_limit ? props.value.length > props.char_limit : false;
  const row: number = props.height ? props.height : 4;

  return (
    <>
      <Stack spacing={1}>
        <Box>
          <Typography variant="h3">{props?.header}</Typography>
          <TextField
            name={props.name}
            sx={{ backgroundColor: "#ffffff" }}
            fullWidth
            multiline
            rows={row}
            placeholder={props.placeholder}
            value={props.value}
            error={props.isErr}
            onChange={props.handleValueChange}
            disabled={props.disabled ? props.disabled : false}
            InputProps={{
              readOnly: props.readOnly,
            }}
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
