import TextField from "@mui/material/TextField";

// type
type props = {
  handleChange: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value: string;
  error: boolean;
  errorMsg: String;
  placeHolder: String;
};

// style
const email_input = {
  width: "23vw",
  minWidth: "260px",
  height: "7vh",
  minHeight: "40px",
};

export default function CommonTextFeild(props: props) {
  return (
    <>
      <TextField
        error={props.error}
        value={props.value}
        onChange={(e) => props.handleChange(e)}
        helperText={props.errorMsg}
        sx={email_input}
        label={props.placeHolder}
        variant="outlined"
      />
    </>
  );
}
