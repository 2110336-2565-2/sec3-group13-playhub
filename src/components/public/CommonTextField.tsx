import { styled } from "@mui/material/styles";
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

const CssTextField = styled(TextField)({
  "& .MuiFormHelperText-root": {
    margin: "0px",
  },
});

export default function CommonTextFeild(props: props) {
  return (
    <>
      <CssTextField
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
