import TextField from "@mui/material/TextField";

type props = {
  handleChange: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value: string;
  error: boolean;
};

export default function EmailTextFeild(props: props) {
  return (
    <>
      <TextField
        error={props.error}
        value={props.value}
        onChange={(e) => props.handleChange(e)}
        sx={{ width: "20vw", minWidth: "260px" }}
        label="Email"
        variant="outlined"
      />
    </>
  );
}
